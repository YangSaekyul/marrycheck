'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ModalOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  type?: 'alert' | 'confirm'
}

interface ModalContextType {
  showAlert: (options: ModalOptions | string) => void
  showConfirm: (options: ModalOptions) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<ModalOptions>({ message: '', type: 'alert' })

  const showAlert = (options: ModalOptions | string) => {
    if (typeof options === 'string') {
      setModalConfig({ message: options, type: 'alert', confirmText: '확인' })
    } else {
      setModalConfig({ ...options, type: 'alert', confirmText: options.confirmText || '확인' })
    }
    setIsOpen(true)
  }

  const showConfirm = (options: ModalOptions) => {
    setModalConfig({
      ...options,
      type: 'confirm',
      confirmText: options.confirmText || '확인',
      cancelText: options.cancelText || '취소'
    })
    setIsOpen(true)
  }

  const handleConfirm = () => {
    setIsOpen(false)
    if (modalConfig.onConfirm) {
      modalConfig.onConfirm()
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (modalConfig.onCancel) {
      modalConfig.onCancel()
    }
  }

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* 모달 UI 레이어 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-6 pb-4">
              {modalConfig.title && (
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {modalConfig.title}
                </h3>
              )}
              <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                {modalConfig.message}
              </p>
            </div>

            <div className="flex border-t border-gray-100">
              {modalConfig.type === 'confirm' && (
                <button
                  onClick={handleCancel}
                  className="flex-1 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  {modalConfig.cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${
                  modalConfig.type === 'confirm' 
                    ? 'text-pink-600 border-l border-gray-100 hover:bg-pink-50' 
                    : 'text-pink-600 hover:bg-pink-50'
                }`}
              >
                {modalConfig.confirmText}
              </button>
            </div>

          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}
