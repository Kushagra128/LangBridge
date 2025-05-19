import img1 from "../assets/matrix/img-1.avif";
import img2 from "../assets/matrix/img-2.jpg";
import img3 from "../assets/matrix/img-3.avif";
import img4 from "../assets/matrix/img-4.jpg";
import img5 from "../assets/matrix/img-5.jpg";
import img6 from "../assets/matrix/img-6.avif";
import img7 from "../assets/matrix/img-7.jpg";
import img8 from "../assets/matrix/img-8.avif";
import img9 from "../assets/matrix/img-9.jpg";
const AuthImagePattern = ({ title, subtitle }) => {
	// Example image URLs (replace these with your actual image sources)
	const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

	return (
		<div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
			<div className="max-w-md text-center">
				<div className="grid grid-cols-3 gap-3 mb-8">
					{images.map((src, i) => (
						<img
							key={i}
							src={src}
							alt={`Pattern ${i + 1}`}
							className={`aspect-square rounded-2xl object-cover ${
								i % 2 === 0 ? "animate-pulse" : ""
							}`}
						/>
					))}
				</div>
				<h2 className="text-2xl font-bold mb-4">{title}</h2>
				<p className="text-base-content/60">{subtitle}</p>
			</div>
		</div>
	);
};

export default AuthImagePattern;
