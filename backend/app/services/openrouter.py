import json
import logging
import httpx
from ..config import settings

logger = logging.getLogger(__name__)

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


async def stream_openrouter(messages: list[dict]) -> str:
    """
    Stream chat completions from OpenRouter.

    Yields extracted text content tokens (not raw JSON).
    Raises on HTTP errors or connection failures.
    """
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": messages,
        "stream": True,
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            async with client.stream("POST", OPENROUTER_URL, headers=headers, json=payload) as response:
                # Check for HTTP errors (401, 429, 500, etc.)
                if response.status_code != 200:
                    error_body = await response.aread()
                    logger.error(f"OpenRouter API error {response.status_code}: {error_body.decode()}")
                    raise httpx.HTTPStatusError(
                        f"OpenRouter returned {response.status_code}",
                        request=response.request,
                        response=response
                    )

                async for line in response.aiter_lines():
                    if not line.startswith("data:"):
                        continue

                    data = line[len("data:"):].strip()

                    # Stream end signal
                    if data == "[DONE]":
                        break

                    try:
                        parsed = json.loads(data)
                        # Extract the actual text content from the SSE payload
                        delta = parsed.get("choices", [{}])[0].get("delta", {})
                        content = delta.get("content")
                        if content:
                            yield content
                    except (json.JSONDecodeError, IndexError, KeyError) as e:
                        logger.warning(f"Failed to parse SSE chunk: {data!r} — {e}")
                        continue

    except httpx.ConnectError:
        logger.error("Failed to connect to OpenRouter API")
        raise RuntimeError("Could not connect to the AI service. Please try again later.")
    except httpx.TimeoutException:
        logger.error("OpenRouter API request timed out")
        raise RuntimeError("AI service request timed out. Please try again.")