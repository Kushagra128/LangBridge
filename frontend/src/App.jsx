import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import HomePage from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import SettingsPage from "./pages/Settings";
import ProfilePage from "./pages/Profile";
import LandingPage from "./pages/Landing";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import VoiceTranslate from "./pages/VoiceTranslate";
import TextScanner from "./pages/TextScanner";
import SpeechToSpeech from "./pages/SpeechToSpeech";
import ChattingPage from "./pages/Chatting";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/userThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";

const App = () => {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
	const { theme } = useThemeStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth)
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader className="size-10 animate-spin" />
			</div>
		);

	return (
		<div
			data-theme={theme}
			className="flex flex-col min-h-screen overflow-hidden"
		>
			<ScrollToTop />
			<Navbar />

			<main className="flex-1 overflow-hidden pt-16">
				<Routes>
					{/* Public landing page */}
					<Route path="/" element={<LandingPage />} />

					{/* Chat page - requires auth */}
					<Route
						path="/chat"
						element={authUser ? <ChattingPage /> : <Navigate to="/login" />}
					/>

					{/* New Chatting page - requires auth */}
					<Route
						path="/chatting"
						element={authUser ? <ChattingPage /> : <Navigate to="/login" />}
					/>

					{/* Auth routes */}
					<Route
						path="/signup"
						element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />}
					/>
					<Route
						path="/login"
						element={!authUser ? <LoginPage /> : <Navigate to="/chat" />}
					/>

					{/* User routes - requires auth */}
					<Route
						path="/settings"
						element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/profile"
						element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
					/>

					{/* About Page */}
					<Route path="/about" element={<About />} />
					<Route path="/services" element={<Services />} />
					<Route path="/contact" element={<Contact />} />

					{/* Voice Translate Page */}
					<Route path="/voice-translate" element={<VoiceTranslate />} />

					{/* Text Scanner Page */}
					<Route path="/text-scanner" element={<TextScanner />} />

					{/* Speech to Speech Page */}
					<Route path="/speech-to-speech" element={<SpeechToSpeech />} />

					{/* Catch-all route for 404 */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>

			<Footer />
			<Toaster />
		</div>
	);
};
export default App;
