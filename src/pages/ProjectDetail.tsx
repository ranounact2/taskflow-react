import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import styles from './ProjectDetail.module.css';

interface Project { id: string; name: string; color: string; }

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: authState, dispatch } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      
      setLoading(true);
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error("Projet introuvable");
        navigate('/dashboard'); // Redirige si le projet n'existe pas (404)
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id, navigate]); // ✅ Dépendances correctes

  if (loading) return <div className={styles.loading}>Chargement du projet...</div>;
  if (!project) return null;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => navigate('/dashboard')}
        // On assure une chaîne vide si le nom n'est pas encore là
        userName={authState.user?.name || "Utilisateur"} 
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      
      <main className={styles.main}>
        <div className={styles.header}>
          {/* Utilise backgroundColor au lieu de background pour le typage style */}
          <span 
            className={styles.dot} 
            style={{ backgroundColor: project.color }} 
          />
          <h2>{project.name}</h2>
        </div>
        
        <div className={styles.card}>
           <p className={styles.info}>
             <strong>ID du projet :</strong> {project.id}
           </p>
           {/* Tu pourras ajouter ici la liste des tâches plus tard */}
        </div>
      </main>
    </div>
  );
}