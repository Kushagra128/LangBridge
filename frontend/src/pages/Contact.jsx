import React, { useState } from "react";

const Contact = () => {
	const [form, setForm] = useState({ name: "", email: "", message: "" });
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// For now, just simulate submission
		setSubmitted(true);
	};

	return (
		<main className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
			<div className="py-12 px-4 max-w-lg mx-auto">
				<section className="text-center mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact Us</h1>
					<p className="text-base sm:text-lg max-w-xl mx-auto">
						Have questions, feedback, or need support with any of LangBridge's
						features—chat, translation, speech, scanning, or more? Reach out to
						the LangBridge team!
					</p>
				</section>
				<section className="bg-base-200 rounded-xl shadow-lg p-6 border border-base-300">
					{submitted ? (
						<div className="text-center">
							<h2 className="text-xl font-semibold text-primary mb-2">
								Thank you!
							</h2>
							<p>Your message has been received. We'll get back to you soon.</p>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block mb-1 font-medium">Name</label>
								<input
									type="text"
									name="name"
									className="input input-bordered w-full"
									value={form.name}
									onChange={handleChange}
									required
								/>
							</div>
							<div>
								<label className="block mb-1 font-medium">Email</label>
								<input
									type="email"
									name="email"
									className="input input-bordered w-full"
									value={form.email}
									onChange={handleChange}
									required
								/>
							</div>
							<div>
								<label className="block mb-1 font-medium">Message</label>
								<textarea
									name="message"
									className="textarea textarea-bordered w-full"
									rows="4"
									value={form.message}
									onChange={handleChange}
									required
								/>
							</div>
							<button type="submit" className="btn btn-primary w-full">
								Send Message
							</button>
						</form>
					)}
				</section>
			</div>
		</main>
	);
};

export default Contact;
