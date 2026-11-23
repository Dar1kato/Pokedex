import { useEffect, useState } from "react";
import { registrar, iniciarSesion, escucharSesion, cerrarSesion } from "./data/auth";
import App from "./App";

function mensajeDeError(error) {
    const mensajes = {
        "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
        "auth/invalid-credential": "El correo o la contraseña no son correctos.",
        "auth/invalid-email": "Ingresa un correo válido.",
        "auth/network-request-failed": "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.",
        "auth/operation-not-allowed": "Activa el acceso con correo y contraseña en Firebase Console > Authentication > Sign-in method.",
        "auth/too-many-requests": "Hubo demasiados intentos. Espera un momento e inténtalo de nuevo.",
        "auth/unauthorized-domain": "Agrega el dominio de esta app a Firebase Console > Authentication > Settings > Authorized domains.",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    };

    return mensajes[error?.code] ?? "No fue posible completar la operación. Inténtalo de nuevo.";
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [revisando, setRevisando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [registrando, setRegistrando] = useState(false);

    useEffect(() => escucharSesion((user) => {
        setUsuario(user);
        setRevisando(false);
    }), []);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setProcesando(true);

        try {
            if (registrando) {
                await registrar(email.trim(), password);
            } else {
                await iniciarSesion(email.trim(), password);
            }
        } catch (authError) {
            setError(mensajeDeError(authError));
        } finally {
            setProcesando(false);
        }
    }

    async function handleSignOut() {
        setError("");

        try {
            await cerrarSesion();
        } catch (authError) {
            setError(mensajeDeError(authError));
        }
    }

    if (revisando) {
        return <main className="auth-page"><p role="status">Comprobando sesión...</p></main>;
    }

    if (usuario) {
        return (
            <>
                <header className="account-bar">
                    <span>Sesión iniciada como <strong>{usuario.email}</strong></span>
                    <button type="button" onClick={handleSignOut}>Cerrar sesión</button>
                    {error && <p className="auth-error" role="alert">{error}</p>}
                </header>
                <App usuario={usuario} />
            </>
        );
    }

    return (
        <main className="auth-page">
            <section className="auth-card" aria-labelledby="auth-title">
                <h1 id="auth-title">{registrando ? "Crear cuenta" : "Iniciar sesión"}</h1>
                <p>{registrando
                    ? "Regístrate para guardar tu equipo Pokémon."
                    : "Inicia sesión para ver y guardar tu equipo Pokémon."}</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        autoComplete="email"
                        id="email"
                        name="email"
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        type="email"
                        value={email}
                    />
                    <label htmlFor="password">Contraseña</label>
                    <input
                        autoComplete={registrando ? "new-password" : "current-password"}
                        id="password"
                        minLength={6}
                        name="password"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        type="password"
                        value={password}
                    />
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <button disabled={procesando} type="submit">
                        {procesando
                            ? "Procesando..."
                            : registrando ? "Crear cuenta" : "Entrar"}
                    </button>
                </form>
                <button
                    className="auth-mode-button"
                    disabled={procesando}
                    onClick={() => {
                        setError("");
                        setRegistrando((current) => !current);
                    }}
                    type="button"
                >
                    {registrando ? "Ya tengo cuenta: iniciar sesión" : "¿No tienes cuenta? Crear una"}
                </button>
            </section>
        </main>
    );
}

export default Login;
