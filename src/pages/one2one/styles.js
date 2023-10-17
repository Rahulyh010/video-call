import { styled } from "styled-components";

export const Call = styled.button`
  border-radius: 10px;
  background-color: #65e11d;
  width: 100px;
  height: 50px;
  border: 1px solid gray;
  &:hover {
    cursor: pointer;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }
`;

export const EndButton = styled.button`
  border-radius: 10px;
  background-color: #e40404;
  width: 100px;
  height: 50px;
  border: 1px solid gray;
  &:hover {
    cursor: pointer;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }
`;

export const VideoContainer = styled.div`
  width: 70%;
  display: flex;
  height: "auto";
  background-color: #f0f0f0;
  justify-content: space-between;
`;

export const VideoBox = styled.video`
  border: 2px solid #333;
  border-radius: 5px;
  width: 300px;
  height: 150px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

export const LargeVideoBox = styled(VideoBox)`
  width: 500px;
  height: 400px;
  border: 0px solid white;
  background-color: white;
`;
export const Flex = styled.div`
  display: flex;
`;

export const Button = styled.button`
  width: 30%;
  height: 50px;
  border: 0px solid gray;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }
`;

export const Input = styled.input`
  width: 60%;
  height: 50px;
  font-size: 20px;
  color: black;
  border-radius: 9px;
  border: 0.5px solid black;
`;
