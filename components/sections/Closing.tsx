import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const Closing: React.FC = () => {
  return (
    <section className="py-40 relative flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#030014]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      <div className="container relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tight mb-8">
            Focus isn't forced.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              It's Designed.
            </span>
          </h2>
          
          <div className="flex justify-center mt-12">
            <Button className="!text-lg !px-12 !py-6">
              Enter FocusED
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-8 left-0 w-full text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} FocusED. All rights reserved.</p>
      </div>
    </section>
  );
};
