import { Term } from '../models/Course'
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useEffect, useState } from 'react';
import StudentAPI from '../services/StudentAPI';
import { ScheduleDraggable } from './ScheduleDraggable';
import './SchedulerComponent.css'

export const ScheduleBlock = () => {
  const [recommendedStatic, setRecommendedStatic] = useState<Term[]>([]);
  const [recommended, setRecommended] = useState<Term[]>([]);
  const [selected, setSelected] = useState<Term[]>([]);

  useEffect(() => {
    StudentAPI.getStudent().then((student) => {
      setRecommended(student.recommended);
      setRecommendedStatic(JSON.parse(JSON.stringify(student.recommended)));

      const selectedTerms = student.recommended.map((term) => {
        return {
          id: term.id,
          term: term.term,
          courses: []
        };
      });

      setSelected(selectedTerms);
    });
  }, []);

  const handleDragDrop = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || destination.droppableId.indexOf('selected-') === -1) {
      return;
    }

    const sourceTermId = source.droppableId.split('-')[1];
    const destinationTermId = destination.droppableId.split('-')[1];

    const sourceTerm = source.droppableId.split('-')[0] === 'recommended' ? 
      recommended.find(term => term.id === sourceTermId) 
      : selected.find(term => term.id === sourceTermId);
    const destinationTerm = selected.find(term => term.id === destinationTermId);

    if (!sourceTerm || !destinationTerm) {
      return;
    }

    const [movedCourse] = sourceTerm.courses.splice(source.index, 1);
    destinationTerm.courses.splice(destination.index, 0, movedCourse);

    setRecommended([...recommended]);
    setSelected([...selected]);
  };

  const handleUndo = (courseId: string, termId: string) => {
    const selectedTerm = selected.find(term => term.id === termId);
    const courseIndex = selectedTerm?.courses.findIndex(course => course.id === courseId);

    if (!selectedTerm || courseIndex === undefined || courseIndex === -1) {
      return;
    }

    const recommendedTerm = recommendedStatic.find(term => term.courses.some(course => course.id === courseId));

    if(!recommendedTerm) {
      return;
    }
    const [removedCourse] = selectedTerm.courses.splice(courseIndex, 1);
    const destinationTerm = recommended.find(term => term.id === recommendedTerm.id);
    if(!destinationTerm) {
      return;
    }

    destinationTerm.courses.push(removedCourse);

    setRecommended([...recommended]);
    setSelected([...selected]);
  }

  const getTotalUnits = (term: Term) => {
    return term.courses.reduce((acc, course) => acc + course.credits, 0);
  }

  return (
    <div className="schedule-block">
      <DragDropContext onDragEnd={handleDragDrop}>
        <div className="recommended-block">
          {recommended.map((term) => (
            <div key={term.id} className="schedule-term">
              <div className="term-header">
                <span className="term-info">{term.term}</span>
              </div>
              <ScheduleDraggable
                courses={term.courses}
                droppableId={`recommended-${term.id}`}
                handleUndo={handleUndo} />
            </div>
          ))}
        </div>
        <div className="selected-block">
          {selected.map((term) => (
            <div key={term.id} className="schedule-term">
              <div className="term-header">
                <span className="term-info">{term.term}</span>
                <span className="term-units">Total Units: {getTotalUnits(term)}</span>
              </div>
              <ScheduleDraggable
                courses={term.courses}
                droppableId={`selected-${term.id}`}
                handleUndo={handleUndo}/>
              </div> 
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}