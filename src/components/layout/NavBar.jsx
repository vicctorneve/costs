import { Link } from 'react-router-dom';
import Container from './Container';
import styles from './NavBar.module.css'
import logo from '../../img/costs_logo.png'
 
function NavBar(){
   return(
      <header className={styles.header}>
         <Container>
            <Link to="/">
               <img src={logo} alt="costs" />
            </Link>
            <nav>
               <ul className={styles.list}>
                  <li>
                     <Link to="/">Home</Link>
                  </li>
                  <li>
                     <Link to="/projects">Projetos</Link>
                  </li>
                  <li>
                     <Link to="/company">Empresa</Link>
                  </li>
                  <li>
                     <Link to="/contact">Contato</Link>
                  </li>
               </ul>
            </nav>
        </Container>
      </header>
   )
}

export default NavBar;