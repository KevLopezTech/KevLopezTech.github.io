import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Optional: if you want an image on this page too

export default function AboutPage() {
    return (
        <main className="bg-gray-900 text-white min-h-screen"> {/* Ensure main content area is below fixed header if body doesn't have enough padding */}
            <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-24"> {/* Added padding here too */}

                <h1 className="text-4xl md:text-5xl font-bold text-center text-cyan-400 mb-12">
                    About Me
                </h1>

                {/* Optional: You could add a profile image here too if desired */}
                {/* <div className="mb-12 flex justify-center">
          <Image
            src="/images/profile-placeholder.jpg" // Replace with your image
            alt="Kevin Lopez"
            width={200}
            height={200}
            className="rounded-full shadow-xl border-2 border-cyan-500/70"
          />
        </div> */}

                <section className="space-y-8 text-lg text-gray-300 leading-relaxed">
                    <p>
                        Hello! I'm Kevin Lopez, a passionate Software Developer with a keen interest in Artificial Intelligence and Machine Learning.
                        My journey into the world of technology began with [mention how you got started or what sparked your interest - e.g., a fascination for how websites were built, a love for problem-solving, a specific project or course].
                    </p>
                    <p>
                        I thrive on building innovative and efficient solutions to complex problems. Whether it's crafting intuitive user interfaces, developing robust backend systems,
                        or exploring the potential of AI, I'm driven by a constant desire to learn and grow. I believe in the power of clean code, thoughtful design,
                        and collaborative teamwork to create impactful digital experiences.
                    </p>

                    <div>
                        <h2 className="text-2xl font-semibold text-cyan-300 mb-3 mt-10">My Philosophy</h2>
                        <p>
                            For me, development is more than just writing code. It's about understanding user needs, architecting sustainable solutions, and continuously refining my craft.
                            I value [mention a few values - e.g., curiosity, perseverance, attention to detail, user-centricity].
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-cyan-300 mb-3 mt-10">Beyond the Code</h2>
                        <p>
                            When I'm not coding, I enjoy [mention a hobby or two - e.g., exploring new technologies, reading about AI advancements, hiking, playing a musical instrument].
                            These interests help me stay creative and bring new perspectives to my work.
                        </p>
                    </div>

                    <div className="text-center pt-8">
                        <Link
                            href="/projects"
                            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 inline-block"
                        >
                            Explore My Projects
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}