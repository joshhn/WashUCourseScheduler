import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { ChatbotComponent } from '../components/ChatbotComponent'
import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { PlannerComponent } from '../components/PlannerComponent'
import { SpinnerComponent } from '../components/SpinnerComponent'
import {
  useAcademicDataContext,
  useStudentContext,
} from '../context/useContext'

import './css/PlannerPage.css'

export default function PlannerPage() {
  const navigate = useNavigate()
  const { academicLoading } = useAcademicDataContext()
  const { semesters } = useStudentContext()

  const handleSave = () => {
    navigate('/dashboard')
  }

  if (academicLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Generating recommended schedule...']} />
      </>
    )
  }

  if (semesters.length === 0) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <div className="planner-page">
          <section className="no-courses">
            <h4>Unable to generate recommended schedule at this time</h4>
            <p>Please try again later</p>
          </section>
        </div>
        <FooterBar />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <Container className="planner-page">
        <div className="planner-header">
          <Row>
            <Col md={5}>
              <Row>
                <Col>
                  <h4>Recommended Schedule</h4>
                </Col>
                <Col md="auto">
                  <button className="secondary" onClick={handleSave}>
                    Save
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <p>Add or Remove Coures from your Upcoming Schedule</p>
          </Row>
        </div>
        <PlannerComponent />
      </Container>
      <ChatbotComponent />
      <FooterBar />
    </>
  )
}
