import styled from "styled-components";

const Container = styled.div`
  width: 50px;
  height: 20px;
  border-radius: 20px;
  background-color: white;
  position: relative;
`;

const Button = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: white;
  border: solid 4px #222;
  position: absolute;
  left: ${({ left }) => (left ? `-1px` : `31px`)};
  transition: left 0.1s;
`;

export default function Slider(props) {
  return (
    <div>
      <Container>
        <Button left={props.left} />
      </Container>
    </div>
  );
}
