import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
	// Female Users
	{
		username: "emma.thompson",
		email: "emma.thompson@example.com",
		fullname: "Emma Thompson",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
		language: "en",
	},
	{
		username: "olivia.miller",
		email: "olivia.miller@example.com",
		fullname: "Olivia Miller",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
		language: "es",
	},
	{
		username: "sophia.davis",
		email: "sophia.davis@example.com",
		fullname: "Sophia Davis",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
		language: "fr",
	},
	{
		username: "ava.wilson",
		email: "ava.wilson@example.com",
		fullname: "Ava Wilson",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
		language: "de",
	},
	{
		username: "isabella.brown",
		email: "isabella.brown@example.com",
		fullname: "Isabella Brown",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
		language: "it",
	},
	{
		username: "mia.johnson",
		email: "mia.johnson@example.com",
		fullname: "Mia Johnson",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/women/6.jpg",
		language: "pt",
	},
	{
		username: "charlotte.williams",
		email: "charlotte.williams@example.com",
		fullname: "Charlotte Williams",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/women/7.jpg",
		language: "ru",
	},
	{
		username: "amelia.garcia",
		email: "amelia.garcia@example.com",
		fullname: "Amelia Garcia",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/women/8.jpg",
		language: "zh",
	},

	// Male Users
	{
		username: "james.anderson",
		email: "james.anderson@example.com",
		fullname: "James Anderson",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
		language: "ja",
	},
	{
		username: "william.clark",
		email: "william.clark@example.com",
		fullname: "William Clark",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
		language: "ar",
	},
	{
		username: "benjamin.taylor",
		email: "benjamin.taylor@example.com",
		fullname: "Benjamin Taylor",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
		language: "hi",
	},
	{
		username: "lucas.moore",
		email: "lucas.moore@example.com",
		fullname: "Lucas Moore",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
		language: "en",
	},
	{
		username: "henry.jackson",
		email: "henry.jackson@example.com",
		fullname: "Henry Jackson",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
		language: "es",
	},
	{
		username: "alexander.martin",
		email: "alexander.martin@example.com",
		fullname: "Alexander Martin",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/men/6.jpg",
		language: "fr",
	},
	{
		username: "daniel.rodriguez",
		email: "daniel.rodriguez@example.com",
		fullname: "Daniel Rodriguez",
		password: "123456",
		profileImage: "https://randomuser.me/api/portraits/men/7.jpg",
		language: "de",
	},
];

const seedDatabase = async () => {
	try {
		await connectDB();

		await User.insertMany(seedUsers);
		console.log("Database seeded successfully");
	} catch (error) {
		console.error("Error seeding database:", error);
	}
};

// Call the function
seedDatabase();
