import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  border?: boolean
  hover?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  border = true,
  hover = false,
  onClick
}) => {
  const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const shadowClasses: Record<string, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }
  
  const roundedClasses: Record<string, string> = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  
  const borderClass = border ? 'border border-gray-200' : ''
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : ''
  const clickableClass = onClick ? 'cursor-pointer' : ''
  
  const classes = [
    'bg-white',
    paddingClasses[padding],
    shadowClasses[shadow],
    roundedClasses[rounded],
    borderClass,
    hoverClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ')
  
  return (
    <div 
      className={classes}
      onClick={onClick}
      {...(onClick && { role: 'button' })}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {children}
    </div>
  )
}

export default Card
