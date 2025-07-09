import React, { createContext, useContext, useReducer } from 'react';

type InterviewState = {
  results: Record<string, Record<string, any>>;
};

type Action = 
  | { type: 'COMPLETE_ROUND', payload: { roleId: string, roundId: string, results: any } }
  | { type: 'RESET_ROLE', payload: { roleId: string } };

const initialState: InterviewState = {
  results: {}
};

const InterviewContext = createContext<{
  state: InterviewState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

const interviewReducer = (state: InterviewState, action: Action): InterviewState => {
  switch (action.type) {
    case 'COMPLETE_ROUND':
      return {
        ...state,
        results: {
          ...state.results,
          [action.payload.roleId]: {
            ...state.results[action.payload.roleId],
            [action.payload.roundId]: action.payload.results
          }
        }
      };
    case 'RESET_ROLE':
      const newResults = { ...state.results };
      delete newResults[action.payload.roleId];
      return {
        ...state,
        results: newResults
      };
    default:
      return state;
  }
};

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(interviewReducer, initialState);
  
  return (
    <InterviewContext.Provider value={{ state, dispatch }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviewContext = () => useContext(InterviewContext);