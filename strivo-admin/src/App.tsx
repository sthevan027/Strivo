import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './features/home/Home'
import Denuncias from './features/denuncias/Denuncias'
import DenunciaDetail from './features/denuncias/DenunciaDetail'
import Acoes from './features/acoes/Acoes'
import Insights from './features/insights/Insights'
import Config from './features/config/Config'
import Moderadores from './features/config/Moderadores'
import Regras from './features/config/Regras'
import Registro from './features/config/Registro'
import Alertas from './features/config/Alertas'
import Suporte from './features/config/Suporte'
import Versao from './features/config/Versao'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/denuncias" element={<Denuncias />} />
          <Route path="/denuncias/:id" element={<DenunciaDetail />} />
          <Route path="/acoes" element={<Acoes />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/config" element={<Config />} />
          <Route path="/config/moderadores" element={<Moderadores />} />
          <Route path="/config/regras" element={<Regras />} />
          <Route path="/config/registro" element={<Registro />} />
          <Route path="/config/alertas" element={<Alertas />} />
          <Route path="/config/suporte" element={<Suporte />} />
          <Route path="/config/versao" element={<Versao />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

