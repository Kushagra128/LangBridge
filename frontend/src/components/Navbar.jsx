import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
	LogOut,
	MessageSquare,
	Settings,
	User,
	Home,
	Info,
	Wrench,
	Mail,
} from "lucide-react";
import React from "react";

const Navbar = () => {
	const { logout, authUser } = useAuthStore();

	return (
		<>
			<header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
				<div className="container mx-auto px-4 h-16">
					<div className="flex items-center justify-between h-full">
						<div className="flex items-center gap-8">
							<Link
								to="/"
								className="flex items-center gap-2.5 hover:opacity-80 transition-all"
							>
								<div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
									<MessageSquare className="w-5 h-5 text-primary" />
								</div>
								<h1 className="text-lg font-bold">LangBridge</h1>
							</Link>

							{/* Desktop Navigation */}
							<nav className="hidden md:flex items-center gap-6">
								<NavLink
									to="/"
									className={({ isActive }) =>
										`flex items-center gap-1.5 hover:text-primary transition-colors ${
											isActive ? "text-primary" : ""
										}`
									}
								>
									<Home className="w-4 h-4" />
									Home
								</NavLink>
								<NavLink
									to="/about"
									className={({ isActive }) =>
										`flex items-center gap-1.5 hover:text-primary transition-colors ${
											isActive ? "text-primary" : ""
										}`
									}
								>
									<Info className="w-4 h-4" />
									About
								</NavLink>
								<NavLink
									to="/services"
									className={({ isActive }) =>
										`flex items-center gap-1.5 hover:text-primary transition-colors ${
											isActive ? "text-primary" : ""
										}`
									}
								>
									<Wrench className="w-4 h-4" />
									Services
								</NavLink>
								<NavLink
									to="/contact"
									className={({ isActive }) =>
										`flex items-center gap-1.5 hover:text-primary transition-colors ${
											isActive ? "text-primary" : ""
										}`
									}
								>
									<Mail className="w-4 h-4" />
									Contact
								</NavLink>
							</nav>
						</div>

						{/* Mobile Chat and Sign-Out Buttons */}
						<div className="md:hidden flex items-center gap-2">
							<Link
								to="/chatting"
								className="btn btn-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								aria-label="Chat"
							>
								<MessageSquare className="w-6 h-6 text-primary" />
							</Link>
							{authUser && (
								<button
									className="btn btn-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
									aria-label="Sign out"
									onClick={logout}
									type="button"
								>
									<LogOut className="w-6 h-6 text-primary" />
								</button>
							)}
						</div>

						{/* Desktop Actions */}
						<div className="hidden md:flex items-center gap-2">
							<Link
								to="/chatting"
								className="btn btn-sm gap-2 transition-colors"
								aria-label="Chat"
							>
								<MessageSquare className="w-4 h-4" />
								<span className="hidden sm:inline">Chat</span>
							</Link>
							<Link
								to="/settings"
								className="btn btn-sm gap-2 transition-colors"
							>
								<Settings className="w-4 h-4" />
								<span className="hidden sm:inline">Settings</span>
							</Link>
							{authUser && (
								<>
									<Link
										to="/profile"
										className="btn btn-sm gap-2 transition-colors"
									>
										<User className="w-4 h-4" />
										<span className="hidden sm:inline">Profile</span>
									</Link>
									<button
										className="btn btn-sm gap-2 transition-colors"
										onClick={logout}
										type="button"
									>
										<LogOut className="w-4 h-4" />
										<span className="hidden sm:inline">Logout</span>
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Bottom Navigation */}
			<nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-base-100 border-t border-base-300 flex justify-around items-center py-2 shadow-xl">
				<NavLink
					to="/"
					className={({ isActive }) =>
						`flex flex-col items-center justify-center p-2 ${
							isActive ? "text-primary" : ""
						}`
					}
				>
					<Home className="w-7 h-7" />
					<span className="sr-only">Home</span>
				</NavLink>
				<NavLink
					to="/about"
					className={({ isActive }) =>
						`flex flex-col items-center justify-center p-2 ${
							isActive ? "text-primary" : ""
						}`
					}
				>
					<Info className="w-7 h-7" />
					<span className="sr-only">About</span>
				</NavLink>
				<NavLink
					to="/services"
					className={({ isActive }) =>
						`flex flex-col items-center justify-center p-2 ${
							isActive ? "text-primary" : ""
						}`
					}
				>
					<Wrench className="w-7 h-7" />
					<span className="sr-only">Services</span>
				</NavLink>
				<NavLink
					to="/contact"
					className={({ isActive }) =>
						`flex flex-col items-center justify-center p-2 ${
							isActive ? "text-primary" : ""
						}`
					}
				>
					<Mail className="w-7 h-7" />
					<span className="sr-only">Contact</span>
				</NavLink>
				<NavLink
					to="/settings"
					className={({ isActive }) =>
						`flex flex-col items-center justify-center p-2 ${
							isActive ? "text-primary" : ""
						}`
					}
				>
					<Settings className="w-7 h-7" />
					<span className="sr-only">Settings</span>
				</NavLink>
				<NavLink
					to="/profile"
					className={({ isActive }) =>
						`flex flex-col items-center justify-center p-2 ${
							isActive ? "text-primary" : ""
						}`
					}
				>
					<User className="w-7 h-7" />
					<span className="sr-only">Profile</span>
				</NavLink>
			</nav>
		</>
	);
};

export default Navbar;
