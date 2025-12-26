import { useState, useEffect } from 'react';
import { motion, useScroll, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button, HeroUIProvider } from '@heroui/react';
import LabLogo from '../assets/images/logo.jpg';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const controls = useAnimation();
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(scrollY.get() > 50);
      controls.start({
        backdropFilter: scrollY.get() > 50 ? 'blur(12px)' : 'none',
        backgroundColor: scrollY.get() > 50 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0)',
        boxShadow: scrollY.get() > 50 ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'
      });
    };
    
    scrollY.onChange(handleScroll);
    return () => scrollY.clearListeners();
  }, []);

  return (
    <motion.nav 
      className="fixed w-full z-50"
      animate={controls}
      initial={{ y: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img 
              src={LabLogo} 
              alt="LabMetrics Pro" 
              className="h-12 w-auto transition-transform"
            />
          </motion.div>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {['Características', 'Soluciones', 'Sobre Nosotros', 'Contacto'].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Button 
                  variant="light" 
                  className="text-primary-800 hover:text-primary-600 font-medium text-lg"
                >
                  {item}
                </Button>
                <motion.div 
                  className="absolute bottom-0 left-0 w-0 h-1 bg-primary-600 group-hover:w-full transition-all duration-300"
                />
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                color="primary" 
                className="bg-primary-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl"
              >
                Sign In
              </Button>
            </motion.div>
          </div>

          {/* Menú Mobile */}
          <button 
            className="md:hidden text-primary-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menú Mobile Desplegable */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white border-t-2 border-primary-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="py-4 space-y-4">
              {['Características', 'Soluciones', 'Sobre Nosotros', 'Contacto'].map((item) => (
                <Button 
                  key={item}
                  variant="light" 
                  className="w-full text-primary-800 hover:bg-primary-50 text-lg"
                >
                  {item}
                </Button>
              ))}
              <Button 
                color="primary" 
                className="w-full bg-primary-600 text-white"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="text-primary-600 text-4xl mb-4">
        <i className={icon} />
      </div>
      <h3 className="text-xl font-bold text-primary-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const TestimonialCard = ({ name, role, content, avatar }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
          {avatar}
        </div>
        <div className="ml-4">
          <h4 className="font-bold text-primary-800">{name}</h4>
          <p className="text-primary-600 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic">"{content}"</p>
      <div className="flex mt-4 text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <i key={star} className="fas fa-star" />
        ))}
      </div>
    </motion.div>
  );
};

const SolutionCard = ({ title, description, features, icon }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      <div className="p-8">
        <div className="text-primary-600 text-4xl mb-4">
          <i className={icon} />
        </div>
        <h3 className="text-xl font-bold text-primary-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 font-medium flex items-center"
        >
          {isExpanded ? 'Ver menos' : 'Ver más'} 
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ml-2`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-primary-50 px-8 py-4"
          >
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <i className="fas fa-check text-primary-600 mt-1 mr-2" />
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StatsSection = () => {
  const stats = [
    { value: 250, label: 'Laboratorios', suffix: '+' },
    { value: 98, label: 'Satisfacción', suffix: '%' },
    { value: 24, label: 'Horas de soporte', suffix: '/7' },
    { value: 15, label: 'Países', suffix: '' }
  ];

  return (
    <section className="py-16 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary-700 mb-2">
                <span className="counter">{stat.value}</span>
                {stat.suffix}
              </div>
              <p className="text-primary-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamMember = ({ name, role, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.2 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl shadow-md text-center"
    >
      <div className="w-32 h-32 mx-auto rounded-full bg-primary-100 mb-4 flex items-center justify-center text-4xl text-primary-600">
        {name.charAt(0)}
      </div>
      <h3 className="text-xl font-bold text-primary-800">{name}</h3>
      <p className="text-primary-600 mb-3">{role}</p>
      <p className="text-gray-600">{description}</p>
      <div className="flex justify-center mt-4 space-x-3">
        {['fab fa-linkedin', 'fab fa-twitter'].map((icon) => (
          <motion.a
            key={icon}
            whileHover={{ y: -3 }}
            href="#"
            className="text-primary-600 hover:text-primary-800"
          >
            <i className={`${icon} text-xl`} />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

const Footer = () => (
  <footer className="bg-primary-800 text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        {/* Columna 1 - Logo y descripción */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={LabLogo} alt="Logo" className="h-12 w-auto"/>
            <span className="text-xl font-bold">LabMetrics Pro</span>
          </div>
          <p className="text-primary-200">
            Innovación y precisión en análisis de datos para laboratorios desde 2023
          </p>
          <div className="flex gap-4">
            {['fab fa-linkedin', 'fab fa-twitter', 'fab fa-facebook'].map((icon) => (
              <motion.div
                key={icon}
                whileHover={{ y: -3 }}
                className="text-primary-200 hover:text-white cursor-pointer"
              >
                <i className={`${icon} text-2xl`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Columna 2 - Soluciones */}
        <div>
          <h4 className="text-lg font-bold mb-4">Soluciones</h4>
          <ul className="space-y-2">
            {['Análisis Clínicos', 'Investigación', 'Control de Calidad', 'Automatización'].map((item) => (
              <motion.li 
                key={item}
                whileHover={{ x: 5 }}
                className="text-primary-200 hover:text-white"
              >
                <a href="#" className="block">{item}</a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Columna 3 - Contacto */}
        <div>
          <h4 className="text-lg font-bold mb-4">Contacto</h4>
          <ul className="space-y-2">
            <li className="text-primary-200 flex items-start">
              <i className="fas fa-envelope mr-2 mt-1" /> contacto@labmetrics.com
            </li>
            <li className="text-primary-200 flex items-start">
              <i className="fas fa-phone-alt mr-2 mt-1" /> +52 55 1234 5678
            </li>
            <li className="text-primary-200 flex items-start">
              <i className="fas fa-map-marker-alt mr-2 mt-1" /> Ciudad de México, MX
            </li>
          </ul>
        </div>

        {/* Columna 4 - Newsletter */}
        <div>
          <h4 className="text-lg font-bold mb-4">Recibe actualizaciones</h4>
          <p className="text-primary-200 mb-4">
            Suscríbete para recibir las últimas noticias y actualizaciones.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Tu correo"
              className="flex-1 px-4 py-2 rounded-lg bg-primary-700 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg"
            >
              <i className="fas fa-paper-plane" />
            </motion.button>
          </form>
        </div>
      </div>

      {/* Derechos reservados */}
      <div className="border-t border-primary-700 pt-8 text-center">
        <p className="text-primary-300">
          © 2023 LabMetrics Pro. Todos los derechos reservados. 
          <span className="block md:inline mt-2 md:mt-0"> 
            <a href="#" className="hover:text-white mx-2">Política de Privacidad</a> | 
            <a href="#" className="hover:text-white mx-2">Términos de Servicio</a>
          </span>
        </p>
      </div>
    </div>
  </footer>
);

export const LandingPage = () => {
  let navigate = useNavigate()

  const features = [
    {
      icon: 'fas fa-chart-line',
      title: 'Análisis en Tiempo Real',
      description: 'Monitorea tus datos de laboratorio con actualizaciones en tiempo real y toma decisiones informadas al instante.'
    },
    {
      icon: 'fas fa-database',
      title: 'Gestión de Datos',
      description: 'Almacena y organiza todos tus resultados de pruebas de manera segura y accesible desde cualquier lugar.'
    },
    {
      icon: 'fas fa-robot',
      title: 'Automatización Inteligente',
      description: 'Reduce errores humanos con nuestro sistema de automatización de procesos de laboratorio.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Seguridad Avanzada',
      description: 'Protección de nivel empresarial para tus datos más sensibles con cifrado de extremo a extremo.'
    },
    {
      icon: 'fas fa-project-diagram',
      title: 'Integraciones',
      description: 'Conecta fácilmente con otros sistemas de gestión de laboratorios y herramientas de análisis.'
    },
    {
      icon: 'fas fa-headset',
      title: 'Soporte 24/7',
      description: 'Nuestro equipo de expertos está disponible en todo momento para resolver tus dudas y problemas.'
    }
  ];

  const solutions = [
    {
      icon: 'fas fa-flask',
      title: 'Laboratorios Clínicos',
      description: 'Solución completa para laboratorios de análisis clínicos y diagnóstico.',
      features: [
        'Gestión de pacientes y muestras',
        'Integración con equipos de laboratorio',
        'Generación automática de reportes',
        'Cumplimiento normativo'
      ]
    },
    {
      icon: 'fas fa-microscope',
      title: 'Investigación',
      description: 'Herramientas avanzadas para laboratorios de investigación y desarrollo.',
      features: [
        'Análisis estadístico avanzado',
        'Colaboración en tiempo real',
        'Gestión de proyectos de investigación',
        'Visualización de datos complejos'
      ]
    },
    {
      icon: 'fas fa-industry',
      title: 'Control de Calidad',
      description: 'Sistemas para garantizar la calidad en laboratorios industriales y de producción.',
      features: [
        'Monitoreo continuo de parámetros',
        'Alertas automáticas de desviaciones',
        'Documentación automática',
        'Auditorías digitales'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Dra. Ana Martínez',
      role: 'Directora de Laboratorio Clínico',
      content: 'LabMetrics Pro ha transformado completamente nuestra eficiencia. Ahora procesamos el doble de muestras con la mitad de errores.',
      avatar: 'AM'
    },
    {
      name: 'Dr. Carlos Ruiz',
      role: 'Investigador Principal',
      content: 'La capacidad de análisis en tiempo real nos ha permitido acelerar nuestros proyectos de investigación significativamente.',
      avatar: 'CR'
    },
    {
      name: 'Ing. Laura Gómez',
      role: 'Gerente de Control de Calidad',
      content: 'Nunca había tenido tanta visibilidad sobre nuestros procesos. Las herramientas de monitoreo son excepcionales.',
      avatar: 'LG'
    }
  ];

  const team = [
    {
      name: 'Dr. Javier López',
      role: 'Fundador & CEO',
      description: 'Experto en bioinformática con más de 15 años en la industria de análisis de laboratorios.'
    },
    {
      name: 'Dra. Sofía Ramírez',
      role: 'Directora Científica',
      description: 'Especialista en sistemas de gestión de calidad para laboratorios certificados.'
    },
    {
      name: 'Ing. Daniel Torres',
      role: 'CTO',
      description: 'Líder tecnológico con experiencia en desarrollo de plataformas de análisis de datos.'
    },
    {
      name: 'Lic. Adriana Vargas',
      role: 'Directora de Operaciones',
      description: 'Experta en optimización de procesos y gestión de equipos multidisciplinarios.'
    }
  ];

  return (
    <HeroUIProvider>
      <div className="relative overflow-hidden">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-24 pb-12 md:py-32 bg-gradient-to-br from-primary-500 to-primary-700">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Transformando el Análisis de Laboratorios
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Precisión científica combinada con tecnología de vanguardia para resultados confiables
            </motion.p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onPress={() => {navigate("/")}}
                  color="background" 
                  size="xl"
                  className="bg-white text-primary-700 px-12 py-6 rounded-2xl shadow-xl"
                >
                  Comenzar Ahora
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="bordered"
                  color="background"
                  size="xl"
                  className="border-2 border-white text-white px-12 py-6 rounded-2xl"
                >
                  Ver Demo
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-primary-800 mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Características Principales
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Descubre cómo nuestra plataforma puede optimizar tus procesos de laboratorio
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-24 bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-primary-800 mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Soluciones Especializadas
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Ofrecemos soluciones adaptadas a las necesidades específicas de tu laboratorio
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <SolutionCard 
                  key={index}
                  title={solution.title}
                  description={solution.description}
                  features={solution.features}
                  icon={solution.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-primary-800 mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Lo que dicen nuestros clientes
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Laboratorios de todo el mundo confían en nuestras soluciones
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index}
                  name={testimonial.name}
                  role={testimonial.role}
                  content={testimonial.content}
                  avatar={testimonial.avatar}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-24 bg-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestra Historia</h2>
                <p className="text-xl text-primary-200 mb-6">
                  Fundada en 2023 por un equipo de científicos e ingenieros apasionados, LabMetrics Pro nació de la necesidad de modernizar los procesos de análisis de laboratorios.
                </p>
                <p className="text-lg text-primary-200 mb-8">
                  Hoy, servimos a más de 250 laboratorios en 15 países, ayudándoles a alcanzar nuevos niveles de precisión, eficiencia y confiabilidad en sus análisis.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    color="background"
                    size="xl"
                    className="bg-white text-primary-700 px-8 py-4 rounded-xl"
                  >
                    Conoce más sobre nosotros
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-primary-700 w-full h-80 rounded-xl shadow-xl">
                  {/* Aquí iría una imagen o ilustración */}
                  <div className="flex items-center justify-center h-full text-4xl">
                    <i className="fas fa-microscope" />
                  </div>
                </div>
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-primary-600 w-32 h-32 rounded-xl shadow-lg flex items-center justify-center text-3xl"
                  whileHover={{ rotate: 10 }}
                >
                  <i className="fas fa-award" />
                </motion.div>
                <motion.div 
                  className="absolute -top-6 -right-6 bg-primary-500 w-24 h-24 rounded-xl shadow-lg flex items-center justify-center text-2xl"
                  whileHover={{ rotate: -10 }}
                >
                  <i className="fas fa-flask" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-primary-800 mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Conoce a nuestro equipo
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Expertos en ciencia, tecnología y gestión de laboratorios
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <TeamMember 
                  key={index}
                  name={member.name}
                  role={member.role}
                  description={member.description}
                  delay={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              ¿Listo para transformar tu laboratorio?
            </motion.h2>
            <motion.p
              className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Agenda una demostración personalizada y descubre cómo podemos ayudarte a optimizar tus procesos.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button 
                color="background" 
                size="xl"
                className="bg-white text-primary-700 px-12 py-6 rounded-2xl shadow-xl"
              >
                Contactar a un especialista
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </HeroUIProvider>
  );
};