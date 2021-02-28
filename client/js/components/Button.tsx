import React, { FC, useCallback } from 'react'

interface ButtonProps {
  onClick?: () => void
}

export const Button: FC<ButtonProps> = ({ onClick, children }) => {
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    onClick?.()
  }, [onClick])

  return (
    <button onClick={handleClick}>{children}</button>
  )
}
