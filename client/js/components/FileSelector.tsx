import React, { FC, useCallback } from 'react'

interface FileSelectorProps {
  onChange?: (file: File | undefined) => void
}

export const FileSelector: FC<FileSelectorProps> = ({ onChange }) => {
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    onChange?.(event?.target?.files?.[0])
  }, [onChange])

  return (
    <input type='file' id='file-selector-' onChange={handleChange} />
  )
}
