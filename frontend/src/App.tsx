import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollBot from './components/ScrollBot';

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300 noise-overlay">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
          </main>
          <Footer />
          <ScrollBot />
        </div>
      </ChatProvider>
    </ThemeProvider>
  );
}
