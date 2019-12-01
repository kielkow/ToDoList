import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
`;

export const FormAdd = styled.form.attrs(props => ({
  displayAdd: props.displayAdd,
}))`
  margin-top: 30px;
  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 10px;
  }

  ${props =>
    !props.displayAdd &&
    css`
      display: none;
    `}
`;

export const FormSearch = styled.form.attrs(props => ({
  displaySearch: props.displaySearch,
}))`
  margin-top: 30px;
  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 10px;
  }

  ${props =>
    !props.displaySearch &&
    css`
      display: none;
    `}

  svg {
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    color: #000;
    margin-top: 15px;

    &:hover {
      color: #e54d3f;
      -webkit-transform: scale(1.3);
      -ms-transform: scale(1.3);
      transform: scale(1.3);
    }
  }
`;

export const Input = styled.input.attrs(props => ({
  error: props.error,
}))`
  flex: 1;
  border: 1px solid #d4c3c3;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 16px;

  ${props =>
    props.error &&
    css`
      border: 2px solid red;
    `}
`;

const rotate = keyframes`
  from{
    transform: rotate(0deg)
  }

  to{
    transform: rotate(360deg)
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading,
}))`
  background: #e54d3f;
  border: 0;
  padding: 0 15px;
  border-radius: 4px;
  width: 50px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const SearchButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading,
}))`
  background: #e54d3f;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;
  width: 50px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const SaveButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading,
}))`
  background: #71c195;
  border: 0;
  width: 50px;
  height: 40px;
  border-radius: 4px;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const EditButton = styled.button.attrs(props => ({
  confirmEdit: props.confirmEdit,
}))`
  background: #fff;
  border: 0;
`;

export const HeaderList = styled.div`
  display: inline-block;
  color: #000;
  font-size: 16px;
  font-weight: bold;
  margin-top: 15px;
  margin-right: 40px;
  margin-left: 40px;

  span {
    margin-right: 35px;
  }
`;

export const List = styled.ul.attrs(props => ({
  readOnly: props.readOnly,
  done: props.done,
}))`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #000;

    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #e54d3f;
      text-decoration: none;
    }

    input {
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #000;
      padding: 6px;
      width: 70px;
    }

    svg {
      cursor: pointer;
      transition: all 0.1s ease-in-out;

      &:hover {
        color: #e54d3f;
        -webkit-transform: scale(1.3);
        -ms-transform: scale(1.3);
        transform: scale(1.3);
      }
    }
  }
`;
