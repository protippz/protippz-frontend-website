import { motion } from "framer-motion";
import { ShieldCheck, Globe, Zap } from "lucide-react";
import stripeLogo from "@/../public/stripe.png";
export default function PoweredByStripe() {
    return (
        <section
            className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="mx-auto max-w-5xl rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-8 sm:p-10 shadow-sm"
                style={{
                    backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #2FC191 100%)
      `,
                    backgroundSize: "100% 100%",
                }}
            >
                <div className="flex flex-col items-center text-center">
                    {/* Stripe Logo */}
                    <img
                        src={stripeLogo?.src}
                        alt="Stripe"
                        className="w-auto h-12 mb-6"
                    />

                    {/* Heading */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                        Trusted Infrastructure for Athlete Support
                    </h2>
                    <p className="text-lg text-slate-600 mt-2">
                        Secure payments powered by Stripe
                    </p>
                </div>

                {/* Features */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Feature
                        icon={<Zap className="h-5 w-5" />}
                        title="Fast, Frictionless Tipping"
                        description="Support athletes in seconds no friction, no barriers. PROTIPPZ makes it easy for fans to tip, engage, and reward athletes instantly."
                    />
                    <Feature
                        icon={<Globe className="h-5 w-5" />}
                        title="Seamless Fan Support"
                        description="Fans can support athletes securely and seamlessly across supported leagues and teams, no matter where the game is played."
                    />
                    <Feature
                        icon={<ShieldCheck className="h-5 w-5" />}
                        title="Trust & Protection Built In"
                        description="Your support is protected by Stripe's industry-leading security and encryption so fans can give confidently and athletes can earn safely."
                    />
                </div>
            </motion.div>
        </section>
    );
}

function Feature({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm"
        >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                {icon}
            </div>
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
        </motion.div>
    );
}
