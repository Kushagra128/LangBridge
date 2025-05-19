import React from "react";
import missionIllustration from "../assets/images/mission/mission.png";

const About = () => {
	return (
		<main className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
			<div className="py-12 px-4 max-w-4xl mx-auto">
				{/* Hero Section */}
				<section className="text-center mb-12">
					<h1 className="text-3xl sm:text-4xl font-bold mb-4">About LangBridge</h1>
					<p className="text-base sm:text-lg max-w-2xl mx-auto">
						LangBridge is your all-in-one multilingual communication platform. Our
						mission is to break down language barriers and connect the world
						through seamless chat, instant translation, speech-to-speech, file
						sharing, and text scanning—all powered by advanced AI.
					</p>
				</section>

				{/* Mission Section */}
				<section className="bg-base-200 rounded-xl shadow-lg p-6 mb-12 border border-base-300">
					<div className="flex flex-col md:flex-row items-center gap-6">
						<div className="md:w-2/3">
							<h2 className="text-2xl font-bold text-primary mb-4">
								Our Mission
							</h2>
							<p className="text-base-content/80 text-base leading-relaxed">
								At LangBridge, we believe communication should know no boundaries.
								Our advanced AI technology empowers individuals and businesses
								to connect instantly—whether by chat, voice, file, or text—no
								matter the language. We're here to make global conversations
								effortless, inclusive, and meaningful across every mode of
								communication.
							</p>
							<ul className="list-disc ml-6 mt-4 text-base-content/80">
								<li>Real-time multilingual chat</li>
								<li>Open text and document translation</li>
								<li>Speech-to-speech translation</li>
								<li>Text scanner for images and PDFs</li>
								<li>Secure file and media sharing</li>
								<li>AI-powered tools for accessibility</li>
							</ul>
						</div>
						<div className="md:w-1/3 flex justify-center">
							<img
								src={missionIllustration}
								alt="Mission Illustration"
								className="w-full max-w-xs h-auto rounded-lg object-contain"
							/>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="text-center bg-primary/10 border border-primary/20 rounded-2xl p-6 shadow-xl">
					<h2 className="text-xl sm:text-2xl font-bold mb-4">
						Ready to Connect?
					</h2>
					<p className="text-base sm:text-lg mb-6">
						Join users breaking language barriers with LangBridge's chat,
						translation, speech, and scanning tools—all in one place.
					</p>
					<a
						href="/"
						className="bg-primary text-white px-6 py-2 rounded-xl font-semibold text-base shadow-md hover:bg-primary-focus focus:ring-2 focus:ring-primary/20 transition-colors duration-200"
					>
						Start Chatting Now
					</a>
				</section>
			</div>
		</main>
	);
};

export default About;
