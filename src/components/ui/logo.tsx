import React from 'react';
import { z } from 'zod';

// Define Zod schema for props validation
const LogoPropsSchema = z.object({
  src: z.string(),
  alt: z.string(),
  className: z.string().optional(),
});

type LogoProps = z.infer<typeof LogoPropsSchema>;

const Logo: React.FC<LogoProps> = ({ src, alt, className }) => {
  // Validate props using Zod schema
  LogoPropsSchema.parse({ src, alt, className });

  return <img src={src} alt={alt} className={className} />;
};

export default Logo;
