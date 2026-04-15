https://canva.link/3dwjegrjh7myigc

-- ============================================================
-- SISTEMA NUTRICIONAL — BANCO DE DADOS CORRIGIDO E MELHORADO
-- Versão: 2.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS sistema_nutri
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sistema_nutri;

-- ============================================================
-- 1. CADASTROS BÁSICOS (criados antes de Usuarios por FK)
-- ============================================================

CREATE TABLE Nutricionistas (
    id_nutri        INT          PRIMARY KEY AUTO_INCREMENT,
    nome            VARCHAR(100) NOT NULL,
    crn             VARCHAR(20)  UNIQUE NOT NULL,
    especialidade   VARCHAR(50),
    email_contato   VARCHAR(100),
    telefone        VARCHAR(15),
    ativo           TINYINT(1)   NOT NULL DEFAULT 1,
    data_cadastro   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Pacientes (
    id_paciente     INT         PRIMARY KEY AUTO_INCREMENT,
    nome            VARCHAR(100) NOT NULL,
    cpf             VARCHAR(11)  UNIQUE NOT NULL,
    data_nascimento DATE         NOT NULL,
    sexo            ENUM('M', 'F', 'Outro'),
    email           VARCHAR(100),
    data_cadastro   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_cpf CHECK (cpf REGEXP '^[0-9]{11}$')
);

-- Telefones separados (3FN — evita campos multivalorados)
CREATE TABLE Telefones_Pacientes (
    id_telefone INT         PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT         NOT NULL,
    ddd         CHAR(2)     NOT NULL,
    numero      VARCHAR(9)  NOT NULL,
    tipo        ENUM('Celular', 'Fixo', 'Recado') DEFAULT 'Celular',
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente) ON DELETE CASCADE
);

-- ============================================================
-- 2. SISTEMA DE USUÁRIOS E ACESSO
-- ============================================================
-- Correção principal: id_referencia substituído por FKs reais
-- e nullable para cada tipo de usuário possível.
-- ============================================================

CREATE TABLE Usuarios (
    id_usuario    INT          PRIMARY KEY AUTO_INCREMENT,
    email         VARCHAR(100) UNIQUE NOT NULL,
    senha_hash    VARCHAR(255) NOT NULL,
    tipo_usuario  ENUM('nutri', 'paciente') NOT NULL,

    -- FKs reais no lugar do id_referencia genérico
    id_nutri      INT NULL,
    id_paciente   INT NULL,

    ativo         TINYINT(1)   NOT NULL DEFAULT 1,
    data_criacao  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME     NULL,

    FOREIGN KEY (id_nutri)    REFERENCES Nutricionistas(id_nutri)  ON DELETE SET NULL,
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente)    ON DELETE SET NULL,

    -- Garante que apenas uma FK está preenchida por vez
    CONSTRAINT chk_usuario_referencia CHECK (
        (tipo_usuario = 'nutri'     AND id_nutri    IS NOT NULL AND id_paciente IS NULL) OR
        (tipo_usuario = 'paciente'  AND id_paciente IS NOT NULL AND id_nutri    IS NULL)
    )
);

-- ============================================================
-- 3. AGENDAMENTOS
-- ============================================================

CREATE TABLE Agendamentos (
    id_agendamento INT      PRIMARY KEY AUTO_INCREMENT,
    id_nutri       INT      NOT NULL,
    id_paciente    INT      NOT NULL,
    data_hora      DATETIME NOT NULL,
    duracao_min    INT      NOT NULL DEFAULT 50,
    status         ENUM('Pendente', 'Confirmado', 'Cancelado', 'Finalizado') DEFAULT 'Pendente',
    observacoes    TEXT     NULL,
    data_criacao   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_nutri)    REFERENCES Nutricionistas(id_nutri),
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente)
);

-- ============================================================
-- 4. PATOLOGIAS (lookup table)
-- ============================================================

CREATE TABLE Patologias (
    id_patologia INT         PRIMARY KEY AUTO_INCREMENT,
    nome         VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO Patologias (nome) VALUES
    ('Diabetes'),
    ('Hipertensão'),
    ('Gastrite'),
    ('Asma'),
    ('Bronquite'),
    ('Doenças cardiovasculares'),
    ('Derrame'),
    ('Câncer'),
    ('Obesidade'),
    ('Outra');

-- ============================================================
-- 5. ANAMNESE COMPLETA
-- ============================================================
-- Melhorias:
--   • Vinculada ao Agendamento (rastreabilidade por consulta)
--   • id_nutri mantido para histórico mesmo sem agendamento
-- ============================================================

CREATE TABLE Anamnese (
    id_anamnese    INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente    INT NOT NULL,
    id_nutri       INT NULL,
    id_agendamento INT NULL,           -- vínculo com a consulta
    data_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Medidas antropométricas
    peso_atual              DECIMAL(5,2),
    altura_cm               INT,
    peso_ideal              DECIMAL(5,2),

    -- Hábitos e estilo de vida
    consome_alcool          ENUM('Sim', 'Não'),
    fuma                    ENUM('Sim', 'Não'),
    pratica_atividade       ENUM('Sim', 'Não'),
    atividade_qual          VARCHAR(100),
    atividade_frequencia_semanal INT,

    -- Saúde e bem-estar
    funcionamento_intestinal ENUM('Regular', 'Irregular'),
    desconforto_intestinal   ENUM('Sim', 'Não'),
    sente_cansaco            ENUM('Sim', 'Não'),
    consumo_agua_litros      DECIMAL(3,1),

    -- Alergias e intolerâncias
    alergia_alimento         TEXT,
    intolerancia_alimento    TEXT,

    -- Recordatório alimentar
    cafe_manha               TEXT,
    almoco                   TEXT,
    jantar                   TEXT,
    outra_refeicao           TEXT,

    FOREIGN KEY (id_paciente)    REFERENCES Pacientes(id_paciente),
    FOREIGN KEY (id_nutri)       REFERENCES Nutricionistas(id_nutri) ON DELETE SET NULL,
    FOREIGN KEY (id_agendamento) REFERENCES Agendamentos(id_agendamento) ON DELETE SET NULL
);

-- ============================================================
-- 6. ANAMNESE × PATOLOGIAS (tabela de ligação — 3FN)
-- ============================================================

CREATE TABLE Anamnese_Patologias (
    id_anamnese         INT NOT NULL,
    id_patologia        INT NOT NULL,
    tipo_relacao        ENUM('Propria', 'Familiar') NOT NULL,
    complemento_outra   VARCHAR(100) NULL,  -- preenchido apenas quando Patologia = 'Outra'

    PRIMARY KEY (id_anamnese, id_patologia, tipo_relacao),
    FOREIGN KEY (id_anamnese)  REFERENCES Anamnese(id_anamnese)   ON DELETE CASCADE,
    FOREIGN KEY (id_patologia) REFERENCES Patologias(id_patologia)
);

-- ============================================================
-- 7. ÍNDICES PARA PERFORMANCE
-- ============================================================

CREATE INDEX idx_agendamentos_data     ON Agendamentos(data_hora);
CREATE INDEX idx_agendamentos_nutri    ON Agendamentos(id_nutri);
CREATE INDEX idx_agendamentos_paciente ON Agendamentos(id_paciente);
CREATE INDEX idx_anamnese_paciente     ON Anamnese(id_paciente);
CREATE INDEX idx_usuarios_email        ON Usuarios(email);

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
