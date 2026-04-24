import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // Delivery form
  const [description, setDescription] = useState("");
  const [adresseDepart, setAdresseDepart] = useState("");
  const [adresseArrivee, setAdresseArrivee] = useState("");
  const [status, setStatus] = useState("PREPARATION");
  const [clientId, setClientId] = useState("");
  const [livreurId, setLivreurId] = useState("");

  // User form
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [disponible, setDisponible] = useState(false);

  const loadDeliveries = () => {
    axios
      .get("http://localhost:8081/deliveries")
      .then((res) => setDeliveries(res.data))
      .catch((err) => console.log(err));
  };

  const loadUsers = () => {
    axios
      .get("http://localhost:8081/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadDeliveries();
    loadUsers();
  }, []);

  const clients = users.filter((u) => u.role === "CLIENT");
  const livreurs = users.filter((u) => u.role === "LIVREUR");
  const admins = users.filter((u) => u.role === "ADMIN");

  const totalDeliveries = deliveries.length;
  const totalPreparation = deliveries.filter(
    (d) => d.status === "PREPARATION"
  ).length;
  const totalTransit = deliveries.filter(
    (d) => d.status === "EN_TRANSIT"
  ).length;
  const totalLivree = deliveries.filter((d) => d.status === "LIVREE").length;

  const addDelivery = () => {
    const newDelivery = {
      description,
      adresseDepart,
      adresseArrivee,
      status,
      client: { id: parseInt(clientId) },
      livreur: livreurId ? { id: parseInt(livreurId) } : null,
    };

    axios
      .post("http://localhost:8081/deliveries", newDelivery)
      .then(() => {
        loadDeliveries();
        setDescription("");
        setAdresseDepart("");
        setAdresseArrivee("");
        setStatus("PREPARATION");
        setClientId("");
        setLivreurId("");
        setMessage("Livraison ajoutée avec succès ✅");
        setActivePage("mesLivraisons");
      })
      .catch((err) => console.log(err));
  };

  const deleteDelivery = (id) => {
    axios
      .delete(`http://localhost:8081/deliveries/${id}`)
      .then(() => {
        loadDeliveries();
        setMessage("Livraison supprimée ❌");
      })
      .catch((err) => console.log(err));
  };

  const updateStatus = (delivery, newStatus) => {
    const updatedDelivery = {
      ...delivery,
      status: newStatus,
    };

    axios
      .put(`http://localhost:8081/deliveries/${delivery.id}`, updatedDelivery)
      .then(() => {
        loadDeliveries();
        setMessage(`Statut mis à jour: ${newStatus} 🚚`);
      })
      .catch((err) => console.log(err));
  };

  const addUser = () => {
    const newUser = {
      nom,
      prenom,
      email,
      password,
      role,
      telephone,
      adresse,
      disponible,
    };

    axios
      .post("http://localhost:8081/users", newUser)
      .then(() => {
        loadUsers();
        setNom("");
        setPrenom("");
        setEmail("");
        setPassword("");
        setRole("CLIENT");
        setTelephone("");
        setAdresse("");
        setDisponible(false);
        setMessage("Utilisateur ajouté avec succès ✅");
      })
      .catch((err) => console.log(err));
  };

  const selectedClientDeliveries = clientId
    ? deliveries.filter((d) => d.client && d.client.id === parseInt(clientId))
    : deliveries;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="page-content">
            <h2>Dashboard</h2>
            <p>Vue générale du système de gestion des livraisons.</p>

            {message && <div className="notification">{message}</div>}

            <div className="cards-grid">
              <div className="card">
                <h3>Total Livraisons</h3>
                <p>{totalDeliveries}</p>
              </div>
              <div className="card">
                <h3>En préparation</h3>
                <p>{totalPreparation}</p>
              </div>
              <div className="card">
                <h3>En transit</h3>
                <p>{totalTransit}</p>
              </div>
              <div className="card">
                <h3>Livrées</h3>
                <p>{totalLivree}</p>
              </div>
            </div>
          </div>
        );

      case "nouvelleLivraison":
        return (
          <div className="page-content">
            <h2>Nouvelle Livraison</h2>
            <p>Le client peut créer une nouvelle demande de livraison.</p>

            <div className="form-card">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="text"
                placeholder="Adresse départ"
                value={adresseDepart}
                onChange={(e) => setAdresseDepart(e.target.value)}
              />

              <input
                type="text"
                placeholder="Adresse arrivée"
                value={adresseArrivee}
                onChange={(e) => setAdresseArrivee(e.target.value)}
              />

              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="PREPARATION">PREPARATION</option>
                <option value="EN_TRANSIT">EN_TRANSIT</option>
                <option value="LIVREE">LIVREE</option>
              </select>

              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Choisir un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom} {client.prenom}
                  </option>
                ))}
              </select>

              <select
                value={livreurId}
                onChange={(e) => setLivreurId(e.target.value)}
              >
                <option value="">Choisir un livreur (optionnel)</option>
                {livreurs.map((livreur) => (
                  <option key={livreur.id} value={livreur.id}>
                    {livreur.nom} {livreur.prenom}
                  </option>
                ))}
              </select>

              <button className="add-btn" onClick={addDelivery}>
                Envoyer la livraison
              </button>
            </div>
          </div>
        );

      case "mesLivraisons":
        return (
          <div className="page-content">
            <h2>Mes Livraisons</h2>
            <p>Le client peut consulter et suivre ses propres livraisons.</p>

            <div className="form-card">
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Choisir un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom} {client.prenom}
                  </option>
                ))}
              </select>
            </div>

            <div className="product-list">
              {selectedClientDeliveries.length === 0 ? (
                <div className="empty-state">Aucune livraison trouvée.</div>
              ) : (
                selectedClientDeliveries.map((d) => (
                  <div className="product" key={d.id}>
                    <div className="product-info">
                      <div className="product-name">{d.description}</div>
                      <div className="product-meta">Départ: {d.adresseDepart}</div>
                      <div className="product-meta">Arrivée: {d.adresseArrivee}</div>
                      <div className="price-badge">Statut: {d.status}</div>
                      <div className="product-meta">
                        Livreur:{" "}
                        {d.livreur
                          ? `${d.livreur.nom} ${d.livreur.prenom}`
                          : "Non affecté"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "livraisons":
        return (
          <div className="page-content">
            <h2>Livraisons</h2>
            <p>Gestion globale des livraisons par l’administrateur.</p>

            <div className="product-list">
              {deliveries.length === 0 ? (
                <div className="empty-state">Aucune livraison trouvée.</div>
              ) : (
                deliveries.map((d) => (
                  <div className="product" key={d.id}>
                    <div className="product-info">
                      <div className="product-name">{d.description}</div>
                      <div className="product-meta">Départ: {d.adresseDepart}</div>
                      <div className="product-meta">Arrivée: {d.adresseArrivee}</div>
                      <div className="price-badge">Statut: {d.status}</div>
                      <div className="product-meta">
                        Client:{" "}
                        {d.client
                          ? `${d.client.nom} ${d.client.prenom}`
                          : "Aucun"}
                      </div>
                      <div className="product-meta">
                        Livreur:{" "}
                        {d.livreur
                          ? `${d.livreur.nom} ${d.livreur.prenom}`
                          : "Aucun"}
                      </div>
                    </div>

                    <div className="actions" style={{ flexDirection: "column" }}>
                      <button
                        className="edit-btn"
                        onClick={() => updateStatus(d, "PREPARATION")}
                      >
                        PREPARATION
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => updateStatus(d, "EN_TRANSIT")}
                      >
                        EN TRANSIT
                      </button>
                      <button
                        className="add-btn"
                        onClick={() => updateStatus(d, "LIVREE")}
                      >
                        LIVREE
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteDelivery(d.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "utilisateurs":
        return (
          <div className="page-content">
            <h2>Utilisateurs</h2>
            <p>Gestion des clients, livreurs et administrateurs.</p>

            <div className="form-card">
              <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />

              <input
                type="text"
                placeholder="Prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="CLIENT">CLIENT</option>
                <option value="LIVREUR">LIVREUR</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <input
                type="text"
                placeholder="Téléphone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />

              <input
                type="text"
                placeholder="Adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
              />

              <select
                value={disponible ? "true" : "false"}
                onChange={(e) => setDisponible(e.target.value === "true")}
              >
                <option value="false">Non disponible</option>
                <option value="true">Disponible</option>
              </select>

              <button className="add-btn" onClick={addUser}>
                Add User
              </button>
            </div>

            <div className="section-title">Clients</div>
            <div className="product-list">
              {clients.length === 0 ? (
                <div className="empty-state">Aucun client trouvé.</div>
              ) : (
                clients.map((user) => (
                  <div className="product" key={user.id}>
                    <div className="product-info">
                      <div className="product-name">
                        {user.nom} {user.prenom}
                      </div>
                      <div className="product-meta">Email: {user.email}</div>
                      <div className="product-meta">
                        Téléphone: {user.telephone}
                      </div>
                      <div className="price-badge">Rôle: {user.role}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="section-title">Livreurs</div>
            <div className="product-list">
              {livreurs.length === 0 ? (
                <div className="empty-state">Aucun livreur trouvé.</div>
              ) : (
                livreurs.map((user) => (
                  <div className="product" key={user.id}>
                    <div className="product-info">
                      <div className="product-name">
                        {user.nom} {user.prenom}
                      </div>
                      <div className="product-meta">Email: {user.email}</div>
                      <div className="product-meta">
                        Téléphone: {user.telephone}
                      </div>
                      <div className="product-meta">Adresse: {user.adresse}</div>
                      <div className="price-badge">
                        {user.disponible ? "Disponible" : "Non disponible"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="section-title">Administrateurs</div>
            <div className="product-list">
              {admins.length === 0 ? (
                <div className="empty-state">
                  Aucun administrateur trouvé.
                </div>
              ) : (
                admins.map((user) => (
                  <div className="product" key={user.id}>
                    <div className="product-info">
                      <div className="product-name">
                        {user.nom} {user.prenom}
                      </div>
                      <div className="product-meta">Email: {user.email}</div>
                      <div className="price-badge">Rôle: {user.role}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="page-content">
            <h2>Notifications</h2>
            <p>Ici on va afficher les notifications du système.</p>

            {message ? (
              <div className="notification">{message}</div>
            ) : (
              <div className="empty-state">Aucune notification.</div>
            )}
          </div>
        );

      case "profil":
        return (
          <div className="page-content">
            <h2>Profil</h2>
            <p>Ici on va afficher les informations du profil utilisateur.</p>
          </div>
        );

      default:
        return (
          <div className="page-content">
            <h2>Dashboard</h2>
          </div>
        );
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">🚚</span>
          <div>
            <h1>QuickDoor</h1>
            <p>Delivery Management</p>
          </div>
        </div>

        <nav className="menu">
          <button
            className={
              activePage === "dashboard" ? "menu-item active" : "menu-item"
            }
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={
              activePage === "nouvelleLivraison"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActivePage("nouvelleLivraison")}
          >
            Nouvelle Livraison
          </button>

          <button
            className={
              activePage === "mesLivraisons" ? "menu-item active" : "menu-item"
            }
            onClick={() => setActivePage("mesLivraisons")}
          >
            Mes Livraisons
          </button>

          <button
            className={
              activePage === "livraisons" ? "menu-item active" : "menu-item"
            }
            onClick={() => setActivePage("livraisons")}
          >
            Livraisons
          </button>

          <button
            className={
              activePage === "utilisateurs" ? "menu-item active" : "menu-item"
            }
            onClick={() => setActivePage("utilisateurs")}
          >
            Utilisateurs
          </button>

          <button
            className={
              activePage === "notifications" ? "menu-item active" : "menu-item"
            }
            onClick={() => setActivePage("notifications")}
          >
            Notifications
          </button>

          <button
            className={
              activePage === "profil" ? "menu-item active" : "menu-item"
            }
            onClick={() => setActivePage("profil")}
          >
            Profil
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>QuickDoor System</h2>
            <p>Gestion moderne des livraisons</p>
          </div>

          <div className="topbar-user">
            <span>Admin / Client</span>
          </div>
        </header>

        {renderPage()}
      </main>
    </div>
  );
}

export default App;