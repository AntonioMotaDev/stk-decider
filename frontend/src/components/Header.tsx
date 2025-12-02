'use client'

import { useTheme } from '@/context/ThemeContext'
import { Sun, Moon, Search, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Búsqueda', icon: Search },
    { href: '/screener', label: 'Explorador', icon: TrendingUp },
    { href: '/predict', label: 'Predicciones', icon: Activity },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-ink-black/80 backdrop-blur-md border-b border-blue-slate/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gunmetal dark:text-white cursor-pointer hover:text-blue-slate transition-colors">
              STK Decider
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-slate text-white'
                      : 'text-gunmetal dark:text-white hover:bg-blue-slate/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-blue-slate/10 hover:bg-blue-slate/20 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gunmetal" />
          ) : (
            <Sun className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </header>
  )
}
