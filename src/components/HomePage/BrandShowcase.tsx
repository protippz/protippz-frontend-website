import Image from 'next/image';
import Marquee from 'react-fast-marquee';

const BRAND_ITEMS = [
    { image: "https://cdn.worldvectorlogo.com/logos/prime-hydration-logo-3.svg", alt: 'Brand 1' },
    { image: "https://cdn.worldvectorlogo.com/logos/primetag.svg", alt: 'Brand 2' },
    { image: "https://cdn.worldvectorlogo.com/logos/prime-varsity-jackets.svg", alt: 'Brand 3' },
    { image: "https://cdn.worldvectorlogo.com/logos/primerica-logo.svg", alt: 'Brand 4' },
    { image: "https://cdn.worldvectorlogo.com/logos/primerica.svg", alt: 'Brand 5' },
    { image: "https://cdn.worldvectorlogo.com/logos/prime-1.svg", alt: 'Brand 6' },
    { image: "https://cdn.worldvectorlogo.com/logos/primera-technology.svg", alt: 'Brand 7' },
];

function BrandShowcase() {
    return (
        <section className="relative max-w-7xl mx-auto w-full flex flex-col gap-4 overflow-hidden">
            {/* Marquee strip */}
            <small className='text-center text-sm text-gray-600'>Changing the game for women&apos;s sports — one tip at a time</small>
            <div className="relative pointer-events-none">
                <Marquee
                    gradient
                    gradientColor="#FAFBFB"
                    speed={38}
                >
                    {[...BRAND_ITEMS, ...BRAND_ITEMS].map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center justify-center"
                        >
                            <div className="
                              bg-white 
                                relative flex items-center justify-center
                                px-5 py-3 rounded-full
                                border border-[#cdcdcd]/60
                                transition-all duration-300 ease-out">
                                <Image
                                    src={item.image}
                                    width={120}
                                    height={48}
                                    alt={item.alt}
                                    className="
                                    h-12! w-auto object-contain
                                    transition-all duration-300 ease-out
                                "
                                />
                            </div>
                            <div className="w-6 h-4 bg-white border-y border-[#cdcdcd]/60"></div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}

export default BrandShowcase;
