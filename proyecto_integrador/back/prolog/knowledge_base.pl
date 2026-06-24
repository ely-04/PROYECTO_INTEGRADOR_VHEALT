%% =============================================================================
%% V-HEALT — Base de conocimiento Prolog (sistema experto de plantas medicinales)
%% Archivo: knowledge_base.pl
%%
%% Este archivo modela un dominio reducido de fitoterapia mediante:
%%   1) HECHOS     — afirmaciones ground (átomos con todos los argumentos instanciados).
%%   2) PREDICADOS — símbolos de relación que agrupan hechos y reglas (p. ej. planta/2).
%%   3) REGLAS     — cláusulas de Horn de la forma:  Head :- Body1, Body2, ...
%%                   (si Body1, Body2, ... son verdaderos, entonces Head es verdadero).
%%
%% INFERENCIA: el motor Prolog (SLD resolution / backward chaining) demuestra metas
%% consultando hechos y unificando variables con reglas hasta encontrar refutaciones
%% exitosas o agotar el espacio de búsqueda.
%% =============================================================================


%% -----------------------------------------------------------------------------
%% PREDICADO: planta/2
%% HECHOS — Verdades absolutas sobre la identidad botánica de cada planta.
%% planta(NombrePlanta, FamiliaBotanica).
%% -----------------------------------------------------------------------------

planta(manzanilla, asteraceae).
planta(jengibre, zingiberaceae).
planta(aloe_vera, asphodelaceae).


%% -----------------------------------------------------------------------------
%% PREDICADO: alivia/2
%% HECHOS — Relación planta → síntoma/enfermedad que puede aliviar (conocimiento
%% empírico simplificado para el sistema experto; no sustituye diagnóstico médico).
%% alivia(NombrePlanta, Sintoma).
%% -----------------------------------------------------------------------------

alivia(manzanilla, dolor_estomago).
alivia(manzanilla, insomnio).
alivia(manzanilla, ansiedad_leve).

alivia(jengibre, nausea).
alivia(jengibre, dolor_estomago).
alivia(jengibre, mareo).

alivia(aloe_vera, irritacion_piel).
alivia(aloe_vera, quemadura_leve).
alivia(aloe_vera, sequedad_piel).


%% -----------------------------------------------------------------------------
%% PREDICADO: paciente/1
%% HECHOS — Pacientes ficticios registrados en el sistema experto.
%% paciente(NombrePaciente).
%% -----------------------------------------------------------------------------

paciente(ana).
paciente(luis).
paciente(maria).
paciente(carlos).


%% -----------------------------------------------------------------------------
%% PREDICADO: alergia/2
%% HECHOS — Restricciones clínicas: alergia del paciente a una familia botánica.
%% alergia(NombrePaciente, FamiliaBotanica).
%% -----------------------------------------------------------------------------

alergia(ana, asteraceae).        % Ana no puede usar manzanilla (familia Asteraceae)
alergia(luis, zingiberaceae).    % Luis no puede usar jengibre
alergia(carlos, asphodelaceae).  % Carlos no puede usar aloe vera


%% =============================================================================
%% REGLAS LÓGICAS (Cláusulas de Horn)
%% =============================================================================


%% -----------------------------------------------------------------------------
%% REGLA 1 — apto/2  (Cláusula de Horn con cuerpo conjuntivo)
%%
%% Forma lógica equivalente:
%%   apto(Paciente, Planta) ← planta(Planta,F) ∧ paciente(Paciente) ∧ ¬alergia(Paciente,F)
%%
%% En Prolog, la negación de un hecho se expresa con \+/1 (negación por fallo / NAFF):
%% si no se puede demostrar alergia(Paciente, Familia), se considera que no hay alergia.
%% -----------------------------------------------------------------------------

apto(Paciente, Planta) :-
    planta(Planta, Familia),
    paciente(Paciente),
    \+ alergia(Paciente, Familia).


%% -----------------------------------------------------------------------------
%% REGLA 2 — recomendar/3  (Regla principal del sistema experto)
%%
%% Forma lógica equivalente:
%%   recomendar(P, S, Pl) ← apto(P, Pl) ∧ alivia(Pl, S)
%%
%% INFERENCIA: dado paciente P y síntoma S, el motor busca toda Planta Pl tal que
%% (1) el paciente no es alérgico a la familia de Pl, y (2) Pl alivia S.
%% -----------------------------------------------------------------------------

recomendar(Paciente, Sintoma, Planta) :-
    apto(Paciente, Planta),
    alivia(Planta, Sintoma).


%% -----------------------------------------------------------------------------
%% REGLA 3 — recomendar_todas/3  (Meta-regla de agregación)
%%
%% Usa findall/3 para reunir todas las soluciones de recomendar/3 en una lista.
%% Facilita la integración con Node.js (una sola consulta → un array JSON).
%%
%% Forma: recomendar_todas(P, S, Lista) ← findall(Pl, recomendar(P,S,Pl), Lista)
%% -----------------------------------------------------------------------------

recomendar_todas(Paciente, Sintoma, Plantas) :-
    findall(Planta, recomendar(Paciente, Sintoma, Planta), Plantas).
