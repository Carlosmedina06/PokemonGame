import React from 'react'

interface BattleProps {
  children?: React.ReactNode
}

export const Battle: React.FC<BattleProps> = ({ children }) => {
  return (
    <div>
      <div className="bg-black min-w-full h-screen">{children}</div>
    </div>
  )
}
