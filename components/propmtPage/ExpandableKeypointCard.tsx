'use client'

import { useOutsideClick } from '@/hooks/use-outside-click'
import { KeyPoint } from '@/lib/types'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

export function ExpandableKeyPointCard ({
  keyPoints
}: {
  keyPoints: KeyPoint[]
}) {
  const [active, setActive] = useState<KeyPoint[] | null>(null)
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
              key={`button-${active[0].id}-${id}`}
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
              layoutId={`card-${active[0].id}-${id}`}
              ref={ref}
              className='w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden'
            >
              <div>
                <div className='flex justify-between items-start p-4'>
                  <div className='flex flex-col gap-2 mb-2'>
                    <div className='flex items-center gap-2'>
                      <motion.h3
                        layoutId={`title-${active[0].id}-${id}`}
                        className='font-bold text-neutral-700 dark:text-neutral-200 break-words text-balance text-xl md:text-2xl leading-tight'
                      >
                        KeyPoints
                      </motion.h3>
                    </div>
                    <motion.p
                      layoutId={`description-${active[0].id}-${id}`}
                      className='text-neutral-600 dark:text-neutral-400 break-words text-pretty text-sm md:text-base leading-relaxed'
                    >
                      KeyPoint of Course
                    </motion.p>
                  </div>
                </div>
                <div className='pt-4 relative px-4'>
                  {keyPoints.map((keyPoint , index) => (
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
                        {!active ? (
                          <p className='text-sm text-muted-foreground'>
                            Generating content...
                          </p>
                        ) : (
                          <div className='space-y-6'>
                            <motion.div key={index} variants={itemVariants}>
                              <Card>
                                <CardHeader>
                                  <CardTitle className='flex items-center'>
                                    <Badge variant='outline' className='mr-3'>
                                      {keyPoint.category}
                                    </Badge>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <motion.ul
                                    variants={containerVariants}
                                    className='space-y-3'
                                  >
                                    {keyPoint.points.map(
                                      (point, pointIndex) => (
                                        <motion.li
                                          key={pointIndex}
                                          variants={itemVariants}
                                          className='flex items-start'
                                        >
                                          <div className='mr-3 h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2' />
                                          <span>{point}</span>
                                        </motion.li>
                                      )
                                    )}
                                  </motion.ul>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div>Generating...</div>
        )}
      </AnimatePresence>
      <motion.div
        layoutId={`card-${keyPoints[0].id}-${id}`}
        key={`card-${keyPoints[0].id}-${id}`}
        onClick={() => setActive(keyPoints)}
        className='p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer'
      >
        <div className='flex gap-4 flex-col md:flex-row'>
          <div>
            <motion.h3
              layoutId={`title-${keyPoints[0].id}-${id}`}
              className='font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left'
            >
              KeyPoints
            </motion.h3>
            <motion.p
              layoutId={`description-${keyPoints[0].id}-${id}`}
              className='text-neutral-600 dark:text-neutral-400 text-center md:text-left'
            >
              KeyPoints of Course
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
