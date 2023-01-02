import {parse, v4 as uuidv4} from 'uuid'
import styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/SeviceForm'
import ServiceCard from '../service/ServiceCard'

function Project(){

   const {id} = useParams()
   const [project, setProject] = useState([])
   const [services, setServices] = useState([])
   const [showProjectForm, setShowProjectForm] = useState(false)
   const [showSeviceForm, setShowSeviceForm] = useState(false)
   const [message, setMessage] = useState('');
   const [type, setType] = useState('sucess')

   useEffect(()=>{
      // Para ver o loading
      setTimeout(()=>{
         fetch(`http://localhost:5000/projects/${id}`,{
            method: "GET",
            headers:{
               "Content-Type": 'application/json',
            },
         })
         .then(resp => resp.json())
         .then(data => {
            setProject(data)
            setServices(data.services)
         })
         .catch(err => console.log(err))
      },300)
   }, [id])

   function editPost(project){
      // budget validation
      setMessage('')
      if(project.budget < project.cost){
         setMessage("O orçamento não pode ser menor que o custo do projeto")
         setType("error")
         return false
      }

      fetch(`http://localhost:5000/projects/${project.id}`,{
         method: "PATCH",
         headers:{
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(project),
      })
      .then(resp => resp.json())
      .then(data => {
         setProject(data)
         setShowProjectForm(!showProjectForm)
         setMessage("Projeto atualizado!")
         setType("sucess")
      })
      .catch(err => console.log(err))
   }

   function createService(project){
      // last service
      setMessage('')
      
      const lastService = project.services[project.services.length - 1]

      lastService.id = uuidv4()

      const lastServiceCost = lastService.cost

      const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
      
      // maximum value validation
      if(newCost > parseFloat(project.budget)){
         setMessage('Orçamento ultrapassado, verifique o valor do seviço')
         setType('error')
         project.services.pop()
         return false 
      }

      // add service cost to project total cost

      project.cost = newCost

      // update project

      fetch(`http://localhost:5000/projects/${project.id}`,{
         method: 'PATCH',
         headers:{
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(project)
      })
      .then(resp => resp.json())
      .then(data =>{
         setServices(data.services)
         setShowSeviceForm(false)
         setType('sucess')
         setMessage('Serviço criado com sucesso!')
         // exbir o servicos
      })
      .catch(err => console.log(err))

      
   }

   function removeService(id,cost){
      setMessage('')
      const servicesUpdated = project.services.filter(
         (service) => service.id !== id
      )

      const projectUpdated = project

      projectUpdated.services = servicesUpdated
      projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

      fetch(`http://localhost:5000/projects/${projectUpdated.id}`,{
         method: 'PATCH',
         headers:{
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(projectUpdated)
      })
      .then(resp => resp.json())
      .then(() =>{
         setProject(projectUpdated)
         setServices(servicesUpdated)
         setType('sucess')
         setMessage('Serviço removido com sucesso!')
      })
      .catch(err => console.log(err))
   }

   function toggleProjectForm(){
      setShowProjectForm(!showProjectForm)
   }
   function toggleServiceForm(){
      setShowSeviceForm(!showSeviceForm)
   }

   return(
      <>
         {project.name ? (
            <div className={styles.project_details}>
               <Container customClass="column">
                  {message && <Message type={type} msg={message}/>}
                  <div className={styles.details_container}>
                     <h1>Projeto: {project.name}</h1>
                     <button className={styles.btn} onClick={toggleProjectForm}>
                        {!showProjectForm ? "Editar projeto" : "Fechar"}
                     </button>
                     {!showProjectForm ? (
                        <div className={styles.project_info}>
                           <p>
                              <span>Categoria: </span> {project.category.name}
                           </p>
                           <p>
                              <span>Total de Orçamento: </span> R${project.budget}
                           </p>
                           <p>
                              <span>Total de Utilizado: </span> R${project.cost}
                           </p>
                        </div>
                     ) : (
                        <div className={styles.project_info}>
                           <ProjectForm 
                              btnText={"Concluir Edição"} 
                              handleSubmit={editPost} 
                              projectData={project} 
                           />
                        </div>
                     )}
                  </div>
                  <div className={styles.service_form_container}>
                     <h2>Adicione um serviço:</h2>
                     <button className={styles.btn} onClick={toggleServiceForm}>
                     {!showSeviceForm ? "Adicionar serviço" : "Fechar"}
                     </button>
                     <div className={styles.project_info}>
                        {showSeviceForm &&(
                           <ServiceForm 
                              handleSubmit={createService}
                              btnText="Adicionar Serviço"
                              projectData={project}
                           />
                        )}
                     </div>
                  </div>
                  <h2>Serviços</h2>
                  <Container customClass="start">
                     {services.length > 0 &&
                        services.map((service) =>(
                           <ServiceCard
                              id={service.id}
                              name={service.name}
                              cost={service.cost}
                              description={service.description}
                              key={service.id}
                              handleRemove={removeService}
                           />
                        ))
                     }
                     {services.length === 0 && <p>Não há serviços cadastrados</p>}
                  </Container>
               </Container>
            </div>
         ) : (
            <Container>
               <Loading/>
            </Container>
         )}
      </>
   )
}

export default Project