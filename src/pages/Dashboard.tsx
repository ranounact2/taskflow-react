import { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';
import axios from 'axios'; // Import nécessaire pour axios.isAxiosError

// Interfaces pour le typage TypeScript
interface Project { id: string; name: string; color: string; }
interface Column { id: string; title: string; tasks: string[]; }

export default function Dashboard() {
  const { state: authState, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true); // Chargement initial
  const [showForm, setShowForm] = useState(false);

  // --- NOUVEAUX ÉTATS (PARTIE 9) ---
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 4.1 GET — Charger les données au montage
  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch (e) { 
        console.error("Erreur chargement:", e); 
      } finally { 
        setLoading(false); 
      }
    }
    fetchData();
  }, []);

  // 4.2 POST — Ajouter un projet (Mis à jour Partie 9)
  async function addProject(name: string, color: string) {
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects(prev => [...prev, data]);
      setShowForm(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }

  // 4.3 PUT — Renommer un projet (Mis à jour avec Gestion Erreur)
  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom :', project.name);

    if (newName && newName !== project.name) {
      setSaving(true);
      setError(null);
      try {
        const { data } = await api.put('/projects/' + project.id, { 
          ...project, 
          name: newName 
        });
        setProjects(prev => prev.map(p => (p.id === project.id ? data : p)));
      } catch (err) {
        setError("Impossible de renommer le projet");
      } finally {
        setSaving(false);
      }
    }
  }

  // 4.4 DELETE — Supprimer un projet (Mis à jour avec Gestion Erreur)
  async function deleteProject(id: string) {
    if (!confirm('Êtes-vous sûr ?')) return;

    setSaving(true);
    setError(null);
    try {
      await api.delete('/projects/' + id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      
      <div className={styles.body}>
        <Sidebar 
          projects={projects} 
          isOpen={sidebarOpen} 
          onRename={renameProject}
          onDelete={deleteProject}
        />
        
        <div className={styles.content}>
          {/* AFFICHAGE DE L'ERREUR (Partie 9) */}
          {error && <div className={styles.errorMsg}>{error}</div>}

          <div className={styles.toolbar}>
            {!showForm ? (
              <button 
                className={styles.addBtn} 
                onClick={() => setShowForm(true)}
                disabled={saving} // Bouton désactivé si on enregistre
              >
                {saving ? 'Action en cours...' : '+ Nouveau projet'}
              </button>
            ) : (
              <ProjectForm
                submitLabel={saving ? "Envoi..." : "Créer"}
                onSubmit={(name, color) => addProject(name, color)}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}