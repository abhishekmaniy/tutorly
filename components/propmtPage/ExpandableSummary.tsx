'use client'

import { useOutsideClick } from '@/hooks/use-outside-click'
import { Summary } from '@/lib/types'
import {
  ArrowRightCircle,
  CheckCircle,
  Lightbulb,
  Star
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'



export function ExpandableSummaryCard ({ summary }: { summary: Summary }) {
  const [active, setActive] = useState<Summary | null>(null)
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
              key={`button-${active.id}-${id}`}
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
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className='w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden'
            >
              <div>
                <div className='flex justify-between items-start p-4'>
                  <div className='flex flex-col gap-2 mb-2'>
                    <div className='flex items-center gap-2'>
                      <motion.h3
                        layoutId={`title-${active.id}-${id}`}
                        className='font-bold text-neutral-700 dark:text-neutral-200 break-words text-balance text-xl md:text-2xl leading-tight'
                      >
                        Summary
                      </motion.h3>
                    </div>
                    <motion.p
                      layoutId={`description-${active.id}-${id}`}
                      className='text-neutral-600 dark:text-neutral-400 break-words text-pretty text-sm md:text-base leading-relaxed'
                    >
                      Summary of {active.course?.title}
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
                      {!active?.overview ? (
                        <p className='text-sm text-muted-foreground'>
                          Generating content...
                        </p>
                      ) : (
                        <div className='space-y-6'>
                          <div>
                            <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-100'>
                              <Lightbulb className='h-5 w-5 text-yellow-500' />
                              Overview
                            </h2>
                            <p className='mt-2 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed'>
                              {active.overview}
                            </p>
                          </div>

                          <div>
                            <h2 className='flex items-center gap-2 text-lg font-semibold text-neutral-800 dark:text-neutral-100'>
                              <CheckCircle className='h-5 w-5 text-green-500' />
                              What You Learned
                            </h2>
                            <ul className='mt-2 list-disc list-inside text-neutral-600 dark:text-neutral-300 text-sm space-y-1'>
                              {active.whatYouLearned.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h2 className='flex items-center gap-2 text-lg font-semibold text-neutral-800 dark:text-neutral-100'>
                              <Star className='h-5 w-5 text-indigo-500' />
                              Skills Gained
                            </h2>
                            <ul className='mt-2 list-disc list-inside text-neutral-600 dark:text-neutral-300 text-sm space-y-1'>
                              {active.skillsGained.map((skill, i) => (
                                <li key={i}>{skill}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h2 className='flex items-center gap-2 text-lg font-semibold text-neutral-800 dark:text-neutral-100'>
                              <ArrowRightCircle className='h-5 w-5 text-blue-500' />
                              Next Steps
                            </h2>
                            <ul className='mt-2 list-disc list-inside text-neutral-600 dark:text-neutral-300 text-sm space-y-1'>
                              {active.nextSteps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div>Generating...</div>
        )}
      </AnimatePresence>
      <motion.div
        layoutId={`card-${summary.id}-${id}`}
        key={`card-${summary.id}-${id}`}
        onClick={() => setActive(summary)}
        className='p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer'
      >
        <div className='flex gap-4 flex-col md:flex-row'>
          <div>
            <motion.h3
              layoutId={`title-${summary.id}-${id}`}
              className='font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left'
            >
              Summary
            </motion.h3>
            <motion.p
              layoutId={`description-${summary.id}-${id}`}
              className='text-neutral-600 dark:text-neutral-400 text-center md:text-left'
            >
              Summary of {summary.course?.title}{' '}
            </motion.p>
          </div>
        </div>
      </motion.div>
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
