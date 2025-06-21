'use client'

import { useOutsideClick } from '@/hooks/use-outside-click'
import { Quiz } from '@/lib/types'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '../ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '../ui/collapsible'

export function ExpandableQuizCard ({ quizes }: { quizes: Quiz[] }) {
  const [active, setActive] = useState<Quiz | null>(null)
  const [quizOpen, setQuizOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    function onKeyDown (event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null)
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  return (
    <>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/20 h-full w-full z-10'
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <div className='fixed inset-0  grid place-items-center z-[100]'>
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05
                }
              }}
              className='flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6'
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className='w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden'
            >
              <div>
                <div className='flex justify-between items-start p-4'>
                  <div className='flex flex-col gap-2 mb-2'>
                    <div className='flex items-center gap-2'>
                      <motion.h3
                        layoutId={`title-${active.title}-${id}`}
                        className='font-bold text-neutral-700 dark:text-neutral-200 break-words text-balance text-xl md:text-2xl leading-tight'
                      >
                        {active.title}
                      </motion.h3>
                    </div>
                    <motion.p
                      layoutId={`description-${active.questions.length}-${id}`}
                      className='text-neutral-600 dark:text-neutral-400 break-words text-pretty text-sm md:text-base leading-relaxed'
                    >
                      {active.questions.length} Questions
                    </motion.p>
                  </div>
                </div>
                <div className='pt-4 relative px-4'>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='relative flex-1 overflow-hidden'
                  >
                    <div
                      className='overflow-y-auto max-h-[calc(100vh-150px)] px-4 pb-24 space-y-6'
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {!active?.questions || active.questions.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>
                          Generating content...
                        </p>
                      ) : (
                        <div className='space-y-4'>
                          <div className='grid grid-cols-2 gap-2 text-sm text-neutral-600 dark:text-neutral-300'>
                            <div className='flex items-center gap-1'>
                              <span className='font-medium'>🕒 Duration:</span>{' '}
                              {active.duration}
                            </div>
                            <div className='flex items-center gap-1'>
                              <span className='font-medium'>
                                📊 Total Marks:
                              </span>{' '}
                              {active.totalMarks}
                            </div>
                            <div className='flex items-center gap-1'>
                              <span className='font-medium'>
                                🎯 Passing Marks:
                              </span>{' '}
                              {active.passingMarks}
                            </div>
                            <div className='flex items-center gap-1'>
                              <span className='font-medium'>❓ Questions:</span>{' '}
                              {active.questions.length}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <Collapsible>
        <CollapsibleTrigger className='w-full px-4 py-2 text-lg font-semibold bg-gray-200 dark:bg-neutral-800 rounded mb-4'>
          <Button
            variant='ghost'
            onClick={() => setQuizOpen(prev => !prev)}
            className='w-full justify-between p-0 h-auto'
          >
            <span className='font-medium'>Quizes ({quizes.length})</span>
            {quizOpen ? (
              <ChevronDown className='h-4 w-4' />
            ) : (
              <ChevronRight className='h-4 w-4' />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {quizes.map(quiz => (
            <ul className='max-w-2xl mx-auto w-full gap-4 space-y-2 px-2'>
              <motion.div
                layoutId={`card-${quiz.title}-${id}`}
                key={`card-${quiz.title}-${id}`}
                onClick={() => setActive(quiz)}
                className='p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer'
              >
                <div className='flex gap-4 flex-col md:flex-row'>
                  <div>
                    <motion.h3
                      layoutId={`title-${quiz.title}-${id}`}
                      className='font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left'
                    >
                      {quiz.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${quiz.id}-${id}`}
                      className='text-neutral-600 dark:text-neutral-400 text-center md:text-left'
                    >
                      {quiz.questions.length} Questions
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </ul>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05
        }
      }}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-4 w-4 text-black'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M18 6l-12 12' />
      <path d='M6 6l12 12' />
    </motion.svg>
  )
}
