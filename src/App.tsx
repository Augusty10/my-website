/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Twitter, Linkedin, Github, FileText, Download, Mail, MapPin } from 'lucide-react';

// --- Custom Cursor Component ---
const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const ringPos = useRef({ x: 0, y: 0 });
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    const animateRing = () => {
      ringPos.current.x += (mousePos.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(-50%, -50%) translate(${ringPos.current.x}px, ${ringPos.current.y}px) scale(${isHovering ? 2.2 : 1})`;
      }
      requestAnimationFrame(animateRing);
    };
    const rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, [mousePos, isHovering]);

  return (
    <>
      <div
        className="fixed w-2 h-2 bg-rust rounded-full pointer-events-none z-9999 transition-transform duration-200"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: `translate(-50%, -50%) scale(${isHovering ? 0 : 1})`,
        }}
      />
      <div
        ref={ringRef}
        className="fixed w-8 h-8 border-1.5 border-rust rounded-full pointer-events-none z-9998 opacity-50"
      />
    </>
  );
};

// --- Canvas Components ---
const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const blobs = [
      { x: 0.65, y: 0.3, r: 0.38, col: '#c94f2c', ox: 0, oy: 0, sp: 0.007 },
      { x: 0.3, y: 0.75, r: 0.3, col: '#c9a84c', ox: 1.5, oy: 0.9, sp: 0.005 },
      { x: 0.85, y: 0.8, r: 0.22, col: '#4a6741', ox: 2.5, oy: 1.8, sp: 0.008 },
      { x: 0.1, y: 0.15, r: 0.18, col: '#2c4a8f', ox: 0.7, oy: 2.1, sp: 0.006 },
    ];

    const draw = () => {
      ctx.fillStyle = '#ede8da';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((b) => {
        const bx = canvas.width * b.x + Math.sin(t * b.sp + b.ox) * 70;
        const by = canvas.height * b.y + Math.cos(t * b.sp + b.oy) * 55;
        const radius = canvas.width * b.r;
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
        g.addColorStop(0, b.col + 'bb');
        g.addColorStop(1, b.col + '00');
        ctx.beginPath();
        ctx.arc(bx, by, radius, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(0,0,0,.03)';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      t++;
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const AboutCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const pts = Array.from({ length: 14 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 200) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(201,79,44,${(1 - d / 200) * 0.55})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,79,44,.7)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const ContactCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.fillStyle = '#ede8da';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let r = 20; r < Math.max(canvas.width, canvas.height) * 1.2; r += 38) {
        ctx.beginPath();
        ctx.arc(cx, cy, r + Math.sin(t * 0.018 + r * 0.04) * 14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201,79,44,${0.05 + 0.03 * Math.sin(t * 0.012 + r * 0.03)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(0,0,0,.05)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fillStyle = '#c94f2c'; ctx.fill();

      t++;
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// --- Section Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-500 px-6 md:px-14 py-7 flex items-center justify-between mix-blend-multiply">
    <div className="font-serif italic text-2xl tracking-tight">Dhanraj Sahu</div>
    <ul className="hidden md:flex gap-12 list-none">
      {['About', 'Projects', 'Education', 'Contact'].map((item) => (
        <li key={item}>
          <a
            href={`#${item.toLowerCase()}`}
            className="text-[0.72rem] tracking-[0.18em] uppercase text-muted hover:text-rust transition-colors duration-250"
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const Hero = () => (
  <section className="min-height-[100vh] grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
    <div className="px-6 md:px-14 pt-35 pb-20 flex flex-col justify-end relative z-2">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex items-center gap-3 text-[0.68rem] tracking-[0.2em] uppercase text-muted mb-8"
      >
        <div className="w-8 h-[1px] bg-rust" />
        Software Engineer · Open to Work
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="font-serif text-[clamp(4rem,7vw,7.5rem)] leading-[0.92] tracking-[-0.03em] font-black mb-2"
      >
        Crafting<br />
        <em className="italic text-rust block">Digital</em><br />
        <span className="outline-text">Experiences</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="font-instrument italic text-lg text-muted my-7 leading-relaxed max-w-[340px]"
      >
        I build systems that scale, interfaces that delight, and code that future engineers actually enjoy reading.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="flex gap-6 items-center"
      >
        <a
          href="#projects"
          className="bg-ink text-paper px-9 py-3.5 text-[0.75rem] tracking-[0.12em] uppercase no-underline transition-all duration-250 hover:bg-rust hover:-translate-y-0.5"
        >
          See My Work
        </a>
        <a
          href="#contact"
          className="text-ink no-underline text-[0.75rem] tracking-[0.12em] uppercase border-b border-muted pb-0.5 transition-colors duration-250 hover:text-rust hover:border-rust"
        >
          Let's Talk
        </a>
      </motion.div>
    </div>
    <div className="relative overflow-hidden bg-cream min-h-[400px] lg:min-h-0">
      <HeroCanvas />
      <div className="absolute bottom-10 left-10 text-[0.65rem] tracking-[0.15em] uppercase text-muted writing-vertical">
        Creative · Technical · Thoughtful
      </div>
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.4 }}
      className="absolute bottom-12 right-14 hidden md:flex flex-col items-center gap-3"
    >
      <div className="w-[1px] h-[60px] bg-muted relative overflow-hidden">
        <div className="absolute top-[-100%] left-0 w-full h-full bg-rust animate-scroll-down" />
      </div>
      <span className="text-[0.6rem] tracking-[0.2em] uppercase text-muted writing-vertical">Scroll</span>
    </motion.div>
  </section>
);

const Marquee = () => (
  <div className="bg-rust py-3.5 overflow-hidden border-t border-black/10 border-b border-black/10 relative z-2">
    <div className="flex w-max animate-marquee">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center">
          {['Full Stack Engineer', 'System Architecture', 'JavaScript · Node.js · React', 'Available for Hire'].map((text, j) => (
            <span key={j} className="flex items-center">
              <span className="font-serif italic text-lg text-paper px-8 whitespace-nowrap">{text}</span>
              <span className="text-white/40 px-2">·</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const About = () => {
  const [isSkillAnimated, setIsSkillAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSkillAnimated(true);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const skills = [
    { name: 'TypeScript', pct: '', delay: 0.4 },
    { name: 'ui/ux', pct: '', delay: 0.5 },
    { name: 'Docker ', pct: '', delay: 0.6 },
    { name: 'MERN', pct: '', delay: 0.7 },
    { name: 'System Design  ', pct: '', delay: 0.8 },
  ];

  return (
    <section id="about" ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh] relative">
      <div className="px-6 md:px-14 py-25 bg-cream flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-rust mb-4">01</div>
          <h2 className="font-serif text-[clamp(2.4rem,4vw,3.8rem)] font-black leading-[1.05] tracking-tight mb-8">
            A builder<br />who <em className="italic text-rust">thinks</em><br />in systems.
          </h2>
          <p className="text-sm leading-loose text-muted mb-4 max-w-[420px]">
            I'm Dhanraj —I am a dedicated Software Engineer completing my MCA, with a strong commitment to both the technical excellence and the practical output of my work. 
          </p>
          <p className="text-sm leading-loose text-muted mb-4 max-w-[420px]">
            My focus is on developing robust and user-centric applications, always striving for that seamless experience. I'm eager to contribute my skills to projects that prioritize both technical excellence and elegant functionality.
          </p>
          <div className="mt-12">
            <div className="text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-5">Core Strengths</div>
            <div className="flex flex-col gap-3.5">
              {skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-4">
                  <span className="text-[0.75rem] w-[110px] shrink-0 tracking-wider uppercase text-ink">{skill.name}</span>
                  <div className="flex-1 h-[3px] bg-black/10 relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-rust origin-left transition-transform duration-1200 cubic-bezier-[0.16,1,0.3,1]"
                      style={{
                        transform: isSkillAnimated ? 'scaleX(1)' : 'scaleX(0)',
                        width: skill.pct,
                        transitionDelay: `${skill.delay}s`,
                      }}
                    />
                  </div>
                  <span className="text-[0.68rem] text-muted w-9 text-right">{skill.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <div className="relative overflow-hidden bg-ink min-h-[400px] lg:min-h-0">
        <AboutCanvas />
        <div className="absolute bottom-15 left-12 right-12 z-2 text-paper">
          <blockquote className="font-serif italic text-xl leading-relaxed mb-4">
            "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
          </blockquote>
          <cite className="text-[0.68rem] tracking-[0.15em] uppercase text-paper/40">— Martin Fowler</cite>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      id: '001',
      title: 'lms Backend with Razorpay',
      desc: 'Learning Management System (LMS) Backend with Secure Razorpay Integration.',
      tags: ['React', 'Razorpay', 'MongoDB', 'API'],
      className: 'col-span-1 lg:col-span-7 min-h-[360px]',
    },
    {
      id: '002',
      title: 'Kola Edit ',
      desc: 'Built a professional portfolio website for Kola Edit Video Editor Agency, enabling them to effectively showcase their video editing expertise and attract new clients.',
      tags: ['React', 'javaScript', 'tailwind'],
      className: 'col-span-1 lg:col-span-5 min-h-[360px] bg-rust text-paper',
      isRust: true,
    },
    {
      id: '003',
      title: 'Resume Screening ',
      desc: 'Building the Screen Resume app to modernize HR candidate evaluation, focusing on dynamic profiles over static resumes. An ongoing project highlighting my development skills and problem-solving approach.',
      tags: ['Python ', 'PostgreSQL'],
      className: 'col-span-1 lg:col-span-4 min-h-[280px] bg-ink text-paper',
      isInk: true,
    },
   
   
  ];

  const handleShare = (platform: 'twitter' | 'linkedin', title: string) => {
    const url = window.location.href;
    const text = `Check out this project: ${title}`;
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <section id="projects" className="px-6 md:px-14 py-30">
      <div className="flex justify-between items-end mb-20">
        <div>
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-rust mb-3">02</div>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-none tracking-tight">
            Selected<br /><em className="italic text-rust">Work</em>
          </h2>
        </div>
        <a href="#" className="text-[0.72rem] tracking-[0.15em] uppercase text-muted no-underline border-b border-muted pb-0.5 hover:text-rust hover:border-rust transition-colors duration-200">
          View All Projects
        </a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className={`interactive group border border-black/8 relative overflow-hidden bg-cream transition-transform duration-400 cubic-bezier-[0.16,1,0.3,1] hover:-translate-y-1.5 ${proj.className}`}
          >
            <div className="absolute inset-0 bg-rust opacity-0 transition-opacity duration-300 group-hover:opacity-3" />
            <div className="p-10 h-full flex flex-col justify-between relative z-1">
              <div className="flex justify-between items-start">
                <span className={`text-[0.62rem] tracking-widest uppercase ${proj.isRust || proj.isInk ? 'text-paper' : 'text-muted'}`}>{proj.id}</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleShare('twitter', proj.title); }}
                    className={`w-9 h-9 border border-black/12 flex items-center justify-center transition-all duration-200 hover:bg-rust hover:border-rust hover:text-paper ${proj.isRust ? 'bg-white/15 border-transparent text-paper' : proj.isInk ? 'bg-white/8 border-transparent text-paper' : 'text-ink'}`}
                    title="Share on Twitter"
                  >
                    <Twitter size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleShare('linkedin', proj.title); }}
                    className={`w-9 h-9 border border-black/12 flex items-center justify-center transition-all duration-200 hover:bg-rust hover:border-rust hover:text-paper ${proj.isRust ? 'bg-white/15 border-transparent text-paper' : proj.isInk ? 'bg-white/8 border-transparent text-paper' : 'text-ink'}`}
                    title="Share on LinkedIn"
                  >
                    <Linkedin size={16} />
                  </button>
                  <div className={`w-9 h-9 border border-black/12 flex items-center justify-center transition-all duration-200 group-hover:bg-rust group-hover:border-rust group-hover:text-paper ${proj.isRust ? 'bg-white/15 border-transparent text-paper' : proj.isInk ? 'bg-white/8 border-transparent text-paper' : 'text-ink'}`}>
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className={`font-serif text-[clamp(1.3rem,2.5vw,1.9rem)] font-black tracking-tight mb-2.5 leading-tight ${proj.isRust || proj.isInk ? 'text-paper' : ''}`}>{proj.title}</h3>
                <p className={`text-[0.8rem] leading-relaxed mb-5 ${proj.isRust || proj.isInk ? 'text-paper/70' : 'text-muted'}`}>{proj.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span key={tag} className={`text-[0.6rem] tracking-widest uppercase border border-black/12 px-2.5 py-1 transition-colors duration-200 group-hover:border-rust group-hover:text-rust ${proj.isRust ? 'text-paper border-paper/30' : proj.isInk ? 'text-paper border-paper/20' : 'text-muted'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Experience = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const experiences = [
    {
      period: '2024 — Now',
      role: 'Master of Computer Applications (MCA) ',
      company: 'Pt. Ravishankar Shukla University',
      desc: 'My foundational stage focuses on core computer science principles and basic programming. Here, I showcase projects that demonstrate my grasp of Data Structures & Algorithms, Object-Oriented Programming, and fundamental database concepts, reflecting my initial steps in software development',
    },
    {
      period: '2021 — 2024',
      role: 'Bachelor of Computer Applications (BCA)  ',
      company: 'Pt.  Ravishankar Shukla University',
      desc: 'Gained foundational knowledge in programming, databases, and web development',
    },

   
  ];

  return (
    <section id="education" className="bg-ink px-6 md:px-14 py-30 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-black text-[28vw] text-white/2 whitespace-nowrap pointer-events-none tracking-tighter">EXP</div>
      <div className="text-[0.65rem] tracking-[0.2em] uppercase text-rust mb-4 relative z-1">03</div>
      <h2 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] font-black tracking-tight text-paper mb-20 relative z-1">
        Where I've<br /><em className="italic text-rust">been.</em>
      </h2>
      <div className="relative pl-0.5">
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-paper/10" />
        <motion.div
          className="absolute left-0 top-0 w-[1px] bg-rust origin-top"
          style={{ scaleY }}
        />
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-14 py-12 pl-10 border-b border-paper/6 relative group"
          >
            <div className="absolute left-[-5px] top-[52px] w-2.5 h-2.5 rounded-full bg-ink border border-paper/20 transition-all duration-200 group-hover:bg-rust group-hover:border-rust" />
            <div className="text-[0.68rem] tracking-widest uppercase text-paper/35 pt-1.5">{exp.period}</div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-paper mb-1.5 tracking-tight">{exp.role}</h3>
              <div className="text-rust text-[0.8rem] tracking-wider mb-4.5">{exp.company}</div>
              <p className="text-[0.83rem] leading-loose text-paper/50 max-w-[520px]">{exp.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Contact = () => {
  const socials = [
    { name: 'GitHub', icon: <Github size={14} />, url: 'https://github.com/Augusty10' },
    { name: 'LinkedIn', icon: <Linkedin size={14} />, url: 'https://www.linkedin.com/in/dhanraj-sahu' },
    { name: 'Twitter', icon: <Twitter size={14} />, url: 'https://x.com/rajxcode' },
  ];

  return (
    <section id="contact" className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-2">
      <div className="px-6 md:px-14 py-25 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-rust mb-4">04</div>
          <h2 className="font-serif text-[clamp(2.8rem,5vw,5rem)] font-black tracking-tight leading-[0.95] mb-10">
            Let's make<br />something<br /><em className="italic text-rust">great.</em>
          </h2>
          
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-muted">
                <Mail size={12} className="text-rust" />
                <span>Email</span>
              </div>
              <a href="mailto:dhanrajsahu.dev@gmail.com" className="font-serif italic text-2xl text-ink no-underline transition-colors duration-200 border-b border-transparent pb-0.5 hover:text-rust hover:border-rust w-fit">
                dhanrajsahu.dev@gmail.com
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-muted">
                <MapPin size={12} className="text-rust" />
                <span>Based in</span>
              </div>
              <p className="font-serif italic text-2xl text-ink">
                New Raipur, India — Open to Remote
              </p>
            </div>

            <div className="pt-10 border-t border-black/10">
              <div className="text-[0.65rem] tracking-widest uppercase text-muted mb-6">Connect & Resume</div>
              <div className="flex flex-wrap gap-4 items-center">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-muted no-underline border border-black/12 px-5 py-3 transition-all duration-200 hover:bg-rust hover:text-paper hover:border-rust"
                  >
                    {social.icon}
                    {social.name}
                  </a>
                ))}
                <a
                  href="/DhanrajsahuOg.pdf"
                  download="Dhanraj_Sahu_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive flex items-center gap-2 bg-ink text-paper text-[0.65rem] tracking-widest uppercase no-underline border border-ink px-6 py-3.5 transition-all duration-200 hover:bg-rust hover:border-rust"
                >
                  <FileText size={14} />
                  Download Resume
                  <Download size={12} className="ml-1 opacity-50" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="bg-cream flex items-center justify-center relative overflow-hidden min-h-[400px] lg:min-h-0">
        <ContactCanvas />
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-ink px-6 md:px-14 py-8 flex flex-col md:flex-row justify-between items-center relative z-2 gap-3 text-center">
    <span className="text-[0.65rem] tracking-widest uppercase text-paper/30">© 2026 Dhanraj Sahu</span>
    <span className="text-[0.65rem] tracking-widest uppercase text-paper/30">Designed & Coded by Hand</span>
    <span className="text-[0.65rem] tracking-widest uppercase text-paper/30">New Raipur, India</span>
  </footer>
);

export default function App() {
  return (
    <main className="font-sans">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
