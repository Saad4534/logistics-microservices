'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment';

type Package = { id: string; title: string; week?: number };
type ScheduledPackage = { id: string; title: string; week: number };

export default function CalendarPackages() {
  const [packages, setPackages] = useState<Package[]>([
    { id: '1', title: 'Package 1' },
    { id: '2', title: 'Package 2' },
  ]);
  const [scheduledPackages, setScheduledPackages] = useState<ScheduledPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<ScheduledPackage | null>(null);
  const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set([1, 2]));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const packageColors = [
    'bg-white text-black',      // Package 1: White
    'bg-blue-600 text-white',   // Package 2: Blue
    'bg-green-600 text-white',  // Package 3: Green
    'bg-yellow-500 text-black', // Package 4: Yellow
    'bg-purple-600 text-white', // Package 5: Purple
    'bg-orange-500 text-black', // Package 6: Orange
    'bg-teal-600 text-white',   // Package 7: Teal
  ];

  const getNextAvailableNumber = () => {
    let nextNum = 1;
    while (usedNumbers.has(nextNum)) {
      nextNum++;
    }
    return nextNum;
  };

  const handleAddPackage = () => {
    const nextNum = getNextAvailableNumber();
    const newPackage = { id: `${Date.now()}`, title: `Package ${nextNum}` };
    setPackages([...packages, newPackage].sort((a, b) => parseInt(a.title.split(' ')[1]) - parseInt(b.title.split(' ')[1])));
    setUsedNumbers(new Set([...usedNumbers, nextNum]));
  };

  const handleRemoveFromList = (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    if (pkg) {
      const num = parseInt(pkg.title.split(' ')[1]);
      setPackages(packages.filter((p) => p.id !== id));
      setScheduledPackages(scheduledPackages.filter((p) => p.id !== id));
      setUsedNumbers(new Set([...usedNumbers].filter((n) => n !== num)));
      if (selectedPackage && selectedPackage.id === id) setSelectedPackage(null);
    }
  };

  const handleRemoveFromWeek = (id: string) => {
    const pkg = scheduledPackages.find((p) => p.id === id);
    if (pkg) {
      setScheduledPackages(scheduledPackages.filter((p) => p.id !== id));
      setPackages([...packages, { id: pkg.id, title: pkg.title }].sort((a, b) => parseInt(a.title.split(' ')[1]) - parseInt(b.title.split(' ')[1])));
      if (selectedPackage && selectedPackage.id === id) setSelectedPackage(null);
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const pkg = packages.find((p) => p.id === draggableId);
    if (!pkg) return;

    if (source.droppableId === 'package-list' && destination.droppableId === 'package-list') {
      // Reorder within package list
      const reorderedPackages = Array.from(packages);
      const [movedPackage] = reorderedPackages.splice(source.index, 1);
      reorderedPackages.splice(destination.index, 0, movedPackage);
      setPackages(reorderedPackages);
    } else if (source.droppableId === 'package-list' && destination.droppableId.startsWith('week-')) {
      // Drop to calendar week
      const weekNumber = parseInt(destination.droppableId.replace('week-', ''), 10);
      const weekPackages = scheduledPackages.filter((p) => p.week === weekNumber);

      if (weekPackages.length >= 7) {
        setErrorMessage(`Cannot add more than 7 packages to Week ${weekNumber}`);
        setSelectedPackage(null);
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      const scheduledPkg = { id: pkg.id, title: pkg.title, week: weekNumber };
      setScheduledPackages([...scheduledPackages.filter((p) => p.id !== pkg.id), scheduledPkg]);
      setPackages(packages.filter((p) => p.id !== pkg.id));
      setSelectedPackage(scheduledPkg);
      setErrorMessage(null);
    }
  };

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sectionVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  // Generate 4 weeks starting from current week
  const weeks = Array.from({ length: 4 }, (_, i) => ({
    weekNumber: moment().week() + i,
    start: moment().week(moment().week() + i).startOf('week').toDate(),
    end: moment().week(moment().week() + i).endOf('week').toDate(),
  }));

  return (
    <section className="relative mt-40 max-w-4xl mx-auto px-6 pb-12">
      <motion.h2
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-2xl text-gray-100 font-semibold mb-2 text-center md:text-left"
      >
        Package Calendar
      </motion.h2>
      <motion.p
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="text-gray-300 mb-8 text-center md:text-left"
      >
        Drag packages to schedule them on the weekly calendar.
      </motion.p>

      <DragDropContext onDragEnd={onDragEnd}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="flex flex-col md:flex-row gap-6"
        >
          {/* Weekly Calendar */}
          <div className="w-full md:w-2/3 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 h-[400px] overflow-y-auto">
            <div className="space-y-4">
              {weeks.map((week) => (
                <Droppable key={week.weekNumber} droppableId={`week-${week.weekNumber}`}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-4 bg-gray-700 rounded-xl min-h-[80px] flex items-center justify-between text-gray-200"
                    >
                      <span>
                        Week {week.weekNumber}: {moment(week.start).format('MMM D')} -{' '}
                        {moment(week.end).format('MMM D')}
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        {scheduledPackages
                          .filter((pkg) => pkg.week === week.weekNumber)
                          .map((pkg, index) => (
                            <div
                              key={pkg.id}
                              className={`group relative flex items-center ${packageColors[index % packageColors.length]} px-2 py-1 rounded`}
                            >
                              <span className="text-sm">{pkg.title}</span>
                              <button
                                onClick={() => handleRemoveFromWeek(pkg.id)}
                                className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-opacity"
                              >
                                X
                              </button>
                            </div>
                          ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>

          {/* Package List */}
          <div className="w-full md:w-1/3">
            <button
              onClick={handleAddPackage}
              className="mb-4 p-2 bg-white text-black rounded-xl hover:bg-gray-300 transition-colors w-full"
            >
              Add Package
            </button>
            <Droppable droppableId="package-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 min-h-[200px] max-h-[400px] overflow-y-auto"
                >
                  {packages.length > 0 ? (
                    packages.map((pkg, index) => (
                      <Draggable key={pkg.id} draggableId={pkg.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="group relative flex justify-between items-center p-2 mb-2 bg-gray-600 rounded-xl"
                          >
                            <span className="text-gray-200">{pkg.title}</span>
                            <button
                              onClick={() => handleRemoveFromList(pkg.id)}
                              className="opacity-0 group-hover:opacity-100 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-opacity"
                            >
                              X
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center italic">No packages left</p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </motion.div>
      </DragDropContext>

      {/* Response Card */}
      <AnimatePresence>
        {selectedPackage || errorMessage ? (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 p-6 rounded-t-lg max-w-3xl mx-auto h-68 overflow-y-auto shadow-lg text-gray-200"
          >
            {errorMessage ? (
              <>
                <h3 className="text-xl font-semibold mb-4">Scheduling Error</h3>
                <p className="text-red-400">{errorMessage}</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">Scheduled Package</h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-400">Package: </span>
                    <span>{selectedPackage?.title}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400">Week: </span>
                    <span>{selectedPackage?.week}</span>
                  </div>
                </div>
              </>
            )}
            <button
              onClick={() => {
                setSelectedPackage(null);
                setErrorMessage(null);
              }}
              className="mt-6 w-full p-2 bg-white text-black rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}