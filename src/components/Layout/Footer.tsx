'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { FaFacebook, FaTwitter } from 'react-icons/fa'

interface LinkType {
  name: string
  href: string
  icon?: string
}

interface FooterSection {
  title: string
  links: LinkType[]
}

const footerLinks: FooterSection[] = [
  {
    title: 'About',
    links: [
      { name: 'Our Story', href: '/about' },
      { name: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'Customer Support', href: '/support' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
]

const socialLinks: LinkType[] = [
  { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
]

// WaveText component definition
const WaveText: React.FC<{ text: string }> = ({ text }) => {
  const controls = useAnimation()

  // Animation or effects logic here (if needed)
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {text}
    </motion.span>
  )
}

// IconRotator component definition (you can customize it as per your need)
const IconRotator: React.FC = () => (
  <motion.span
    className="text-red-600"
    animate={{ rotate: [0, 360] }}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    ❤️
  </motion.span>
)

export default function Footer() {
  const [email, setEmail] = useState<string>('')
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const currentYear = new Date().getFullYear()

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription logic
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and social links */}
          <div className="col-span-1 lg:col-span-2">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold">Prime Hub</span>
          </Link>
            <p className="text-gray-400 mb-4">
              Discover unique products from independent creators and brands around the world.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="sr-only">{link.name}</span>
                  {link.icon === 'facebook' && <FaFacebook className="h-6 w-6" />}
                  {link.icon === 'twitter' && <FaTwitter className="h-6 w-6" />}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter subscription */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
          <p className="text-gray-400 mb-4">Stay updated with our latest products and offers</p>
          <form onSubmit={handleSubscribe} className="flex max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-grow px-4 py-2 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-r-md font-medium transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-green-400"
            >
              Thank you for subscribing!
            </motion.p>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <WaveText text={`© ${currentYear} Chiemezie Agbo`} />
          </div>
          <div className="flex items-center space-x-2">
            <span>Made with</span>
            <IconRotator />
            <span>by Chiemezie</span>
          </div>
        </div>
        <motion.div
          className="mt-4 text-base text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Empowering the web with innovative solutions</p>
        </motion.div>
      </div>
    </footer>
  )
}
