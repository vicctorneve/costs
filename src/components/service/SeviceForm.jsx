import { useState } from 'react'
import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

import styles from './Service.module.css'

function ServiceForm({ handleSubmit, btnText, projectData }) {
  const [service, setService] = useState({
                                name: '',
                                cost: 0,
                                description: ''
                                })

  function handleChange(e) {
    setService({ ...service, [e.target.name]: e.target.value })
  }

  const submit = (e) => {
    e.preventDefault()
    projectData.services.push(service)
    handleSubmit(projectData)
  }


  return (
    <form onSubmit={submit} className={styles.form_control}>
      <label htmlFor="name_service">Nome do serviço</label>
      <input
        id='name_service'
        type="text"
        name="name"
        placeholder="Insira o nome do serviço"
        onChange={handleChange}>
      </input>
      {/* <Input
        type="text"
        text="Nome do serviço"
        name="name"
        placeholder="Insira o nome do serviço"
        handleOnChange={handleChange}
        value={service.name}
      /> */}
      <label htmlFor="cost">Custo do serviço</label>
      <input
        type="number"
        name="cost"
        id='cost'
        placeholder="Insira o valor total"
        onChange={handleChange}>
      </input>
      {/* <Input
        type="number"
        text="Custo do serviço"
        name="cost"
        placeholder="Insira o valor total"
        handleOnChange={handleChange}
      /> */}
      <label htmlFor="description">Descrição do projeto</label>
      <input
        id='description'
        type="text"
        name="description"
        placeholder="Descreva o serviço"
        onChange={handleChange}>
      </input>
      {/* <Input
        type="text"
        text="Descrição do projeto"
        name="description"
        placeholder="Descreva o serviço"
        handleOnChange={handleChange}
      /> */}
      <SubmitButton text={btnText} />
    </form>
  )
}

export default ServiceForm