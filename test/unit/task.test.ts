// test/unit/task.test.ts
import { TaskService } from "../../src/services/task.service";
import { Task } from "../../src/models/task.model";
import { expect } from "chai";
import { mock } from "jest-mock";

jest.mock("../../src/models/task.model");
const mockedTaskModel = Task as jest.Mocked<typeof Task>;

describe("TaskService", () => {
  beforeEach(() => {
    mockedTaskModel.createOne.mockReset();
    mockedTaskModel.findAll.mockReset();
  });

  it("should successfully create a task", async () => {
    const taskData = { title: "Test Task", description: "Description" };
    const mockCreatedTask = { _id: "someId", ...taskData } as any;

    mockedTaskModel.createOne.mockResolvedValue(mockCreatedTask);

    const createdTask = await TaskService.createOne(taskData);

    expect(mockedTaskModel.createOne).to.have.been.calledWith(taskData);
    expect(createdTask).to.deep.equal(mockCreatedTask); // Using Chai's deep.equal
  });

  it("should successfully retrieve all tasks", async () => {
    const mockTasks = [
      { _id: "1", title: "Task 1" },
      { _id: "2", title: "Task 2" },
    ] as any[];
    mockedTaskModel.findAll.mockResolvedValue(mockTasks);
    mockedTaskModel.countAll.mockResolvedValue(mockTasks.length);

    const { data: tasks } = await TaskService.findAll({}, 0, 10);

    expect(mockedTaskModel.findAll).to.have.been.calledWith({}, 0, 10);
    expect(tasks).to.deep.equal(mockTasks); // Using Chai's deep.equal
  });
});
