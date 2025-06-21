// 'use client'

// import { useOutsideClick } from '@/hooks/use-outside-click'
// import { KeyPoint, Summary } from '@/lib/types'
// import {
//   ArrowRightCircle,
//   CheckCircle,
//   ChevronDown,
//   ChevronRight,
//   FolderKanban,
//   Lightbulb,
//   Star
// } from 'lucide-react'
// import { AnimatePresence, motion } from 'motion/react'
// import { useEffect, useId, useRef, useState } from 'react'
// import { Button } from '../ui/button'
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger
// } from '../ui/collapsible'
// import { Badge } from '../ui/badge'

// export function ExpandableQuizCard ({ keyPoints }: { keyPoints: KeyPoint[] }) {
//   const [active, setActive] = useState<KeyPoint[] | null>(null)
//   const [keyPointOpen, setKeyPointOpen] = useState(false)
//   const ref = useRef<HTMLDivElement>(null)
//   const id = useId()

//   useEffect(() => {
//     function onKeyDown (event: KeyboardEvent) {
//       if (event.key === 'Escape') {
//         setActive(null)
//       }
//     }

//     if (active && typeof active === 'object') {
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.overflow = 'auto'
//     }

//     window.addEventListener('keydown', onKeyDown)
//     return () => window.removeEventListener('keydown', onKeyDown)
//   }, [active])

//   useOutsideClick(ref, () => setActive(null))

//   return (
//     <>
//       <AnimatePresence>
//         {active && typeof active === 'object' && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className='fixed inset-0 bg-black/20 h-full w-full z-10'
//           />
//         )}
//       </AnimatePresence>
//       <AnimatePresence>
//         {active && typeof active === 'object' ? (
//           <div className='fixed inset-0  grid place-items-center z-[100]'>
//             <motion.button
//               key={`button-${active}-${id}`}
//               layout
//               initial={{
//                 opacity: 0
//               }}
//               animate={{
//                 opacity: 1
//               }}
//               exit={{
//                 opacity: 0,
//                 transition: {
//                   duration: 0.05
//                 }
//               }}
//               className='flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6'
//               onClick={() => setActive(null)}
//             >
//               <CloseIcon />
//             </motion.button>
//             <motion.div
//               layoutId={`card-${active.}-${id}`}
//               ref={ref}
//               className='w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden'
//             >
//               <div>
//                 <div className='flex justify-between items-start p-4'>
//                   <div className='flex flex-col gap-2 mb-2'>
//                     <div className='flex items-center gap-2'>
//                       <motion.h3
//                         layoutId={`title-${active.id}-${id}`}
//                         className='font-bold text-neutral-700 dark:text-neutral-200 break-words text-balance text-xl md:text-2xl leading-tight'
//                       >
//                         KeyPoint
//                       </motion.h3>
//                     </div>
//                     <motion.p
//                       layoutId={`description-${active.id}-${id}`}
//                       className='text-neutral-600 dark:text-neutral-400 break-words text-pretty text-sm md:text-base leading-relaxed'
//                     >
//                       Keypoint of {active.course?.title}
//                     </motion.p>
//                   </div>
//                 </div>
//                 <div className='pt-4 relative px-4'>
//                   <motion.div
//                     layout
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className='relative flex-1 overflow-hidden'
//                   >
//                     <div
//                       className='overflow-y-auto max-h-[calc(100vh-150px)] px-4 pb-24 space-y-6'
//                       style={{ WebkitOverflowScrolling: 'touch' }}
//                     >
//                       {!active?.category ? (
//                         <p className='text-sm text-muted-foreground'>
//                           Generating content...
//                         </p>
//                       ) : (
//                         <div className='space-y-4'>
//                           <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-100'>
//                             <FolderKanban className='h-5 w-5 text-purple-500' />
//                             Key Points
//                           </h2>

//                           <div className='space-y-4'>
//                             {active.map((category, index) => (
//                               <motion.div
//                                 key={index}
//                                 variants={itemVariants}
//                                 className='rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4'
//                               >
//                                 <div className='flex items-center gap-2 mb-3'>
//                                   <Badge variant='outline' className='text-xs'>
//                                     {category.category}
//                                   </Badge>
//                                 </div>

//                                 <motion.ul
//                                   variants={containerVariants}
//                                   className='space-y-2 pl-2'
//                                 >
//                                   {category.points.map((point, pointIndex) => (
//                                     <motion.li
//                                       key={pointIndex}
//                                       variants={itemVariants}
//                                       className='flex gap-2 text-neutral-700 dark:text-neutral-300 text-sm'
//                                     >
//                                       <div className='h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0' />
//                                       <span>{point}</span>
//                                     </motion.li>
//                                   ))}
//                                 </motion.ul>
//                               </motion.div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         ) : null}
//       </AnimatePresence>

//       <Button
//         variant='ghost'
//         onClick={() => setKeyPointOpen(prev => !prev)}
//         className='w-full justify-between p-0 h-auto'
//       >
//         <span className='font-medium'>Keypoints </span>
//       </Button>
//     </>
//   )
// }

// export const CloseIcon = () => {
//   return (
//     <motion.svg
//       initial={{
//         opacity: 0
//       }}
//       animate={{
//         opacity: 1
//       }}
//       exit={{
//         opacity: 0,
//         transition: {
//           duration: 0.05
//         }
//       }}
//       xmlns='http://www.w3.org/2000/svg'
//       width='24'
//       height='24'
//       viewBox='0 0 24 24'
//       fill='none'
//       stroke='currentColor'
//       strokeWidth='2'
//       strokeLinecap='round'
//       strokeLinejoin='round'
//       className='h-4 w-4 text-black'
//     >
//       <path stroke='none' d='M0 0h24v24H0z' fill='none' />
//       <path d='M18 6l-12 12' />
//       <path d='M6 6l12 12' />
//     </motion.svg>
//   )
// }
