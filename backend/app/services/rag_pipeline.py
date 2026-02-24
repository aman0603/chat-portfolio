from .vector_store import query_vector_store
from ..config import settings

SYSTEM_PROMPT = """\
You are a portfolio assistant for Aman Paswan. Your ONLY job is to answer questions \
using the CONTEXT provided in each user message.

STRICT RULES — you MUST follow these without exception:
1. NEVER use your training data to answer. ONLY use information from the CONTEXT block.
2. If the CONTEXT does not contain the answer, say exactly: \
"I don't have that information. Feel free to reach out to Aman directly at amanpaswan464@gmail.com"
3. Do NOT mention any projects, skills, companies, or facts that are not explicitly stated in the CONTEXT.
4. Do NOT make assumptions or fill gaps with plausible-sounding information.
5. If asked about projects: ONLY list projects that appear in the CONTEXT. Never invent project names.
6. Keep answers concise and factual. Use bullet points for lists.
7. For greetings, respond briefly and invite the visitor to ask about Aman's work.
8. If asked something unrelated to Aman, say: "I'm here to help you learn about Aman's work!"

REMEMBER: Every single thing you say must be traceable to the CONTEXT block. \
If it's not in the CONTEXT, it doesn't exist.\
"""


def build_messages(
    user_query: str,
    chat_history: list[dict] | None = None,
    top_k: int | None = None,
) -> list[dict]:
    """
    Build the full message list for the LLM, including:
    1. System prompt (strict anti-hallucination rules)
    2. User message with embedded context + question (so LLM cannot ignore context)
    3. Recent chat history for conversational memory

    Args:
        user_query: The user's current question.
        chat_history: Previous messages as [{"role": "user"/"assistant", "message": "..."}].
        top_k: Number of context chunks to retrieve (defaults to settings.TOP_K_RESULTS).
    """
    if top_k is None:
        top_k = settings.TOP_K_RESULTS

    # 1. Retrieve relevant context from vector store
    context_chunks = query_vector_store(user_query, top_k=top_k)
    context_text = "\n\n---\n\n".join(context_chunks) if context_chunks else "No relevant context found."

    # 2. System message
    messages: list[dict] = [
        {"role": "system", "content": SYSTEM_PROMPT},
    ]

    # 3. Add recent chat history for conversational memory
    if chat_history:
        max_history = settings.MAX_CHAT_HISTORY
        recent_history = chat_history[-max_history:]
        for entry in recent_history:
            role = entry.get("role", "user")
            content = entry.get("message", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

    # 4. Embed context INSIDE the user message so the model cannot ignore it.
    #    Many free models deprioritise secondary system messages but always read
    #    the user turn they are responding to.
    grounded_user_message = f"""\
[CONTEXT — use ONLY this to answer. Do NOT use your training knowledge.]
{context_text}
[END CONTEXT]

Question: {user_query}"""

    messages.append({"role": "user", "content": grounded_user_message})

    return messages