'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useOutsideClick } from '@/hooks/use-outside-click'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible'
import { Button } from '../ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Lesson } from '@/lib/types'
import { ContentBlocksRenderer } from './ContentBlocksRenderer'

export function ExpandableLessonCard ({ lessons }: { lessons: Lesson[] }) {
  const [active, setActive] = useState<Lesson | null>(null)
  const [lessonsOpen, setLessonsOpen] = useState(false)
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
                      layoutId={`description-${active.description}-${id}`}
                      className='text-neutral-600 dark:text-neutral-400 break-words text-pretty text-sm md:text-base leading-relaxed'
                    >
                      {active.description}
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
                      className='overflow-y-auto max-h-[calc(100vh-150px)] px-4 pb-24 space-y-6 scrollbar-thin 
  scrollbar-thumb-gray-400 scrollbar-track-gray-200
  dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900'
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {!active?.contentBlocks ||
                      active.contentBlocks.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>
                          Generating content...
                        </p>
                      ) : (
                        <ContentBlocksRenderer
                          contentBlocks={active.contentBlocks}
                        />
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
            onClick={() => setLessonsOpen(prev => !prev)}
            className='w-full justify-between p-0 h-auto'
          >
            <span className='font-medium'>Lessons ({lessons.length})</span>
            {lessonsOpen ? (
              <ChevronDown className='h-4 w-4' />
            ) : (
              <ChevronRight className='h-4 w-4' />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {lessons.map(lesson => (
            <ul className='max-w-2xl mx-auto w-full gap-4 space-y-2 px-2'>
              <motion.div
                layoutId={`card-${lesson.title}-${id}`}
                key={`card-${lesson.title}-${id}`}
                onClick={() => {
                  setActive(lesson)
                  window.scrollTo({ top: 0, behavior: 'smooth' }) // 
                }}
                className='p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer'
              >
                <div className='flex gap-4 flex-col md:flex-row'>
                  <div>
                    <motion.h3
                      layoutId={`title-${lesson.title}-${id}`}
                      className='font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left'
                    >
                      {lesson.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${lesson.description}-${id}`}
                      className='text-neutral-600 dark:text-neutral-400 text-center md:text-left'
                    >
                      {lesson.description}
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

const card = [
  {
    id: 'lesson1',
    title: 'Introduction to Algebra',
    description:
      'Learn the basics of algebra including variables and expressions.',
    duration: '10 min',
    contentBlocks: [
      {
        id: 'block1',
        type: 'TEXT',
        text: 'Algebra is a branch of mathematics dealing with symbols and rules for manipulating those symbols.'
      },
      {
        id: 'block2',
        type: 'MATH',
        math: 'x^2 + y^2 = z^2'
      },
      {
        id: 'block3',
        type: 'CODE',
        code: 'const sum = (a, b) => a + b;'
      }
    ]
  },
  {
    id: 'lesson2',
    title: 'Advanced Algebra',
    description: 'Dive deeper into algebraic equations and polynomials.',
    duration: '15 min',
    contentBlocks: [
      {
        id: 'block1',
        type: 'TEXT',
        text: "In advanced algebra, you'll learn to work with quadratic equations."
      },
      {
        id: 'block2',
        type: 'CODE',
        code: 'function quadratic(a, b, c) {\n  return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);\n}'
      }
    ]
  }
]
