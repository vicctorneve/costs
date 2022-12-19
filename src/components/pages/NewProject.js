import { useNavigate } from 'react-router-dom'
import Form from '../project/ProjectForm'
import styles from './NewProject.module.css'

function NewProject(){
   const navigate = useNavigate()

   function createPost(project) {
      // Initialize cost and services
      project.cost = 0;
      project.services = [];

      fetch("http://localhost:5000/projects",{
         method: "POST",
         headers:{
            "Content-type": "application/json",
         },
         body: JSON.stringify(project)
      })
      .then(resp => resp.json())
      .then(data => {
         navigate('/projects', {state:{message: 'Projeto criado com sucesso'}} )
      })
      .catch(err => console.log(err))
   }

   return (
      <section className={styles.newproject_container}>
         <h1>Criar Projeto</h1>
         <p>Crie seu projeto para depois adicionar os serviços</p>
         <Form handleSubmit={createPost} btnText="Criar projeto"/>
      </section>
   )
}

export default NewProject