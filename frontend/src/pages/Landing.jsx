import { Link } from "react-router-dom";
import {
	MessageSquare,
	Globe,
	Volume2,
	Image,
	Mic,
	EyeOff,
} from "lucide-react";
import {
	FaLanguage,
	FaMicrophoneAlt,
	FaFileAlt,
	FaComments,
	FaGlobe,
	FaLock,
	FaPaperclip,
	FaMicrophone,
	FaRobot,
} from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

// Reusable Card Component for Services
const Card = ({ to, icon, title, description, className, ...props }) => (
	<Link
		to={to}
		className={`group bg-base-100 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}
		{...props}
	>
		<motion.div
			whileHover={{ scale: 1.2, rotate: 5 }}
			transition={{ duration: 0.2 }}
		>
			{icon}
		</motion.div>
		<span className="font-bold text-lg mt-2 mb-1">{title}</span>
		<span className="text-base-content/70 group-hover:text-white text-center text-sm">
			{description}
		</span>
	</Link>
);

// Reusable Feature Banner Component
const FeatureBanner = ({ title, description, color, icon }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		className={`rounded-2xl shadow-xl p-6 flex flex-col items-start bg-gradient-to-br ${color} text-white min-h-[180px] relative overflow-hidden transition-all duration-500 group cursor-pointer hover:shadow-2xl hover:scale-[1.03] animated-gradient`}
	>
		<div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0" />
		<motion.div whileHover={{ scale: 1.1 }} className="relative z-10">
			{icon}
		</motion.div>
		<h3 className="text-xl font-extrabold mb-2 drop-shadow-lg relative z-10">
			{title}
		</h3>
		<p className="text-sm font-medium opacity-90 relative z-10">
			{description}
		</p>
	</motion.div>
);

// Reusable Testimonial Card Component
const TestimonialCard = ({ name, role, quote, avatar }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.95 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ duration: 0.4 }}
		className="bg-base-200 p-6 rounded-2xl border border-base-300 hover:shadow-lg transition-all hover:border-primary/50 hover:bg-base-100"
	>
		<div className="flex items-center mb-4">
			<img
				src={avatar}
				alt={`${name}'s avatar`}
				className="w-12 h-12 rounded-full mr-4 object-cover"
			/>
			<div>
				<h4 className="text-lg font-bold">{name}</h4>
				<p className="text-sm text-base-content/70">{role}</p>
			</div>
		</div>
		<p className="text-sm italic opacity-80">"{quote}"</p>
	</motion.div>
);

const services = [
	{
		to: "/voice-translate",
		icon: (
			<FaLanguage
				size={32}
				className="mb-3 group-hover:scale-110 transition-transform"
			/>
		),
		title: "Open Translator",
		description: "Translate text between 20+ languages with ease.",
	},
	{
		to: "/speech-to-speech",
		icon: (
			<FaMicrophoneAlt
				size={32}
				className="mb-3 group-hover:scale-110 transition-transform"
			/>
		),
		title: "Speech-to-Speech",
		description: "Speak and get instant translation in another language.",
	},
	{
		to: "/text-scanner",
		icon: (
			<FaFileAlt
				size={32}
				className="mb-3 group-hover:scale-110 transition-transform"
			/>
		),
		title: "Text Scanner",
		description: "Extract and translate text from images or PDFs.",
		isNew: true,
	},
];

const featureBanners = [
	{
		title: "Real-time Chat",
		description:
			"Instant messaging with friends and colleagues, anywhere in the world.",
		color: "from-sky-100 to-blue-200 dark:from-base-300 dark:to-base-200",
		icon: <FaComments size={32} className="mb-3 drop-shadow-lg" />,
	},
	{
		title: "Multilingual Support",
		description: "Communicate in 20+ languages with seamless translation.",
		color: "from-purple-100 to-pink-200 dark:from-base-200 dark:to-base-100",
		icon: <FaGlobe size={32} className="mb-3 drop-shadow-lg" />,
	},
	{
		title: "Secure Messaging",
		description: "Your conversations are encrypted and private.",
		color:
			"from-green-100 to-green-200 dark:from-primary/30 dark:to-primary/10",
		icon: <FaLock size={32} className="mb-3 drop-shadow-lg" />,
	},
	{
		title: "File Sharing",
		description: "Send images, documents, and more with a single click.",
		color: "from-yellow-100 to-yellow-200 dark:from-base-300 dark:to-base-100",
		icon: <FaPaperclip size={32} className="mb-3 drop-shadow-lg" />,
	},
	{
		title: "Voice Messages",
		description: "Record and send voice messages for a personal touch.",
		color: "from-blue-100 to-indigo-200 dark:from-base-200 dark:to-base-100",
		icon: <FaMicrophone size={32} className="mb-3 drop-shadow-lg" />,
	},
	{
		title: "AI Translation",
		description: "Leverage AI to translate and format your messages instantly.",
		color: "from-pink-100 to-fuchsia-200 dark:from-base-300 dark:to-base-200",
		icon: <FaRobot size={32} className="mb-3 drop-shadow-lg" />,
	},
];

const testimonials = [
	{
		name: "Anna Rodriguez",
		role: "Freelance Translator",
		quote:
			"LangBridge has transformed how I communicate with clients globally. The real-time translation is flawless, and the speech-to-speech feature saves me so much time!",
		avatar: "https://randomuser.me/api/portraits/women/44.jpg",
	},
	{
		name: "Michael Chen",
		role: "International Business Consultant",
		quote:
			"The text scanner is a game-changer for quickly translating documents during meetings. LangBridge's secure messaging also gives me peace of mind.",
		avatar: "https://randomuser.me/api/portraits/men/32.jpg",
	},
	{
		name: "Sofia Patel",
		role: "Travel Blogger",
		quote:
			"I love how easy it is to connect with locals using LangBridge. The voice message translation feels so natural, and the app is super intuitive!",
		avatar: "https://randomuser.me/api/portraits/women/65.jpg",
	},
];

const LandingPage = () => {
	const { authUser } = useAuthStore();
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("animate-in");
					}
				});
			},
			{ threshold: 0.1 }
		);

		document.querySelectorAll(".section").forEach((section) => {
			observer.observe(section);
		});

		return () => observer.disconnect();
	}, []);

	return (
		<div className="min-h-[calc(100vh-4rem)] overflow-x-hidden">
			{/* Hero Section */}
			<section className="py-20 bg-gradient-to-b from-base-300 to-base-100 section">
				<div className="container mx-auto px-4 text-center">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5 }}
						className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
					>
						<MessageSquare className="h-12 w-12 text-primary" />
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight"
					>
						Welcome to <span className="text-primary">LangBridge</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.8 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
					>
						The all-in-one multilingual communication platform: chat, translate,
						speak, and share—without language barriers. Experience real-time
						messaging, instant translation, voice-to-voice conversations, and
						text scanning in one seamless app.
					</motion.p>
					<div className="flex flex-wrap justify-center gap-4">
						<AnimatePresence>
							{authUser ? (
								<motion.div
									key="dashboard"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
								>
									<Link
										to="/services"
										className="btn btn-primary btn-lg hover:scale-105 transition-transform"
										aria-label="Go to Services"
									>
										Go to Services
									</Link>
								</motion.div>
							) : (
								<>
									<motion.div
										key="signin"
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
									>
										<Link
											to="/login"
											className="btn btn-primary btn-lg hover:scale-105 transition-transform"
											aria-label="Sign In"
										>
											Sign In
										</Link>
									</motion.div>
									<motion.div
										key="signup"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
									>
										<Link
											to="/signup"
											className="btn btn-outline btn-lg hover:bg-primary hover:text-white transition-all"
											aria-label="Create Account"
										>
											Create Account
										</Link>
									</motion.div>
								</>
							)}
						</AnimatePresence>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className="py-12 section">
				<div className="container mx-auto px-4">
					<motion.h2
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="text-3xl md:text-4xl font-bold text-center mb-10"
					>
						Explore Our Core Services
					</motion.h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{services.map((service) => (
							<div className="relative" key={service.title}>
								<Card
									to={service.to}
									icon={service.icon}
									title={service.title}
									description={service.description}
								/>
								{service.isNew && (
									<span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow">
										New
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Banners Section */}
			<section className="py-12 section">
				<div className="container mx-auto px-4">
					<motion.h2
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="text-3xl md:text-4xl font-bold text-center mb-10"
					>
						Powerful Features for Seamless Communication
					</motion.h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{featureBanners.map((feature) => (
							<FeatureBanner
								key={feature.title}
								title={feature.title}
								description={feature.description}
								color={feature.color}
								icon={feature.icon}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-16 section">
				<div className="container mx-auto px-4">
					<motion.h2
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="text-3xl md:text-4xl font-bold text-center mb-12"
					>
						What Our Users <span className="text-primary">Say</span>
					</motion.h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{testimonials.map((testimonial) => (
							<TestimonialCard
								key={testimonial.name}
								name={testimonial.name}
								role={testimonial.role}
								quote={testimonial.quote}
								avatar={testimonial.avatar}
							/>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-base-200 section">
				<div className="container mx-auto px-4 text-center">
					<motion.h2
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="text-3xl md:text-4xl font-bold mb-4"
					>
						Ready to experience next-gen communication?
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.8 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="text-lg md:text-xl max-w-3xl mx-auto mb-8"
					>
						Join thousands of users breaking language barriers with LangBridge's
						chat, translation, voice, and scanning tools—all in one place.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						{authUser ? (
							<Link
								to="/services"
								className="btn btn-primary btn-lg hover:scale-105 transition-transform"
								aria-label="Go to services"
							>
								Go to Services
							</Link>
						) : (
							<Link
								to="/signup"
								className="btn btn-primary btn-lg hover:scale-105 transition-transform"
								aria-label="Get Started for Free"
							>
								Get Started for Free
							</Link>
						)}
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
