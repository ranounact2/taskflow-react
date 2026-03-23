import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Vérifie que le nom correspond à ton fichier CSS

// Définition de la structure d'un projet
interface Project {
  id: string;
  name: string;
  color: string;
}

// Définition des "props" que la Sidebar reçoit du Dashboard
interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename: (project: Project) => void;   // La fonction renameProject du Dashboard
  onDelete: (id: string) => void;        // La fonction deleteProject du Dashboard
}

export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Mes Projets</h3>
      <ul className={styles.projectList}>
        {projects.map((p) => (
          <li key={p.id} className={styles.projectItem}>
            {/* Lien de navigation vers le détail du projet */}
            <NavLink
              to={`/projects/${p.id}`}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.dot} style={{ backgroundColor: p.color }} />
              <span className={styles.projectName}>{p.name}</span>
            </NavLink>

            {/* Petits boutons d'action (Optionnel mais recommandé pour ton TP) */}
            <div className={styles.actions}>
              <button 
                onClick={() => onRename(p)} 
                title="Renommer"
                className={styles.actionBtn}
              >
                ✏️
              </button>
              <button 
                onClick={() => onDelete(p.id)} 
                title="Supprimer"
                className={styles.actionBtn}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}