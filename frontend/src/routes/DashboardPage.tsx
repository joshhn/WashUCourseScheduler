import { useEffect, useState } from 'react'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { ScheduleRow } from '../components/ScheduleRow'
import { Term } from '../models/Course'
import PlannerAPI from '../services/PlannerAPI'

import './css/DashboardPage.css'

export default function DashboardPage() {
  const [selected, setSelected] = useState<Term[]>([])

  useEffect(() => {
    PlannerAPI.getPlanner().then((plan) => {
      setSelected(plan.selected)
    })
  }, [])

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="dashboard-page">
        <h3>Current Schedule</h3>
        {selected.map((term) => (
          <div key={term.id}>
            <div className="term-header">
              <span className="term-info">{term.term}</span>
            </div>
            {term.courses.map((course) => (
              <ScheduleRow key={course.id} course={course} />
            ))}
          </div>
        ))}
      </div>
      <FooterBar />
    </>
  )
}
