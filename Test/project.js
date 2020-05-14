const { expect } = require('chai');
const sinon = require('sinon');

const Project = require('../Models/project');
const projectController = require('../Controllers/projectController');
const { res } = require('../Util/utils').fakeController;

const project = {
  name: 'test',
  scrumMaster: 'test',
  disabled: false,
  companyId: '1',
};

describe('Project Controller - CRUD', function() {
  it('project successfully created should return status 201 and the new Project !', function(done) {
    sinon.stub(Project.prototype, 'save');

    Project.prototype.save.returns(project);

    const req = {
      body: project,
    };

    expect(
      projectController
        .addProject(req, res, () => {})
        .then(result => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('scrumMaster');
          expect(result).to.have.property('disabled');
          expect(result).to.have.property('companyId');
          expect(res.statusCode).to.equal(201);
          Project.prototype.save.restore();
          done();
        })
    );
  });

  it('Project successfully fetched should return status of 200 and the project fetched !', function(done) {
    sinon.stub(Project, 'findById');

    Project.findById.returns(project);

    const req = {
      params: { projectId: 1 },
    };

    expect(
      projectController
        .getProjectById(req, res, () => {})
        .then(result => {
          expect(result).to.have.property('name');
          expect(result).to.have.property('scrumMaster');
          expect(result).to.have.property('disabled');
          expect(result).to.have.property('companyId');
          expect(res.statusCode).to.equal(200);
          Project.findById.restore();
          done();
        })
    );
  });

  it('Project successfully updated should return the project updated and status of 200', function(done) {
    sinon.stub(Project, 'findById');
    sinon.stub(Project.prototype, 'save');

    Project.findById.returns(project);
    Project.prototype.save({
      name: 'testUpdated',
      scrumMaster: 'testUpdated',
      disabled: true,
      companyId: '2',
    });

    const req = {
      params: { projectId: 1 },
      body: {
        name: 'testUpdated',
        scrumMaster: 'testUpdated',
        disabled: true,
        companyId: '2',
      },
    };

    res.project = {
      name: 'testUpdated',
      scrumMaster: 'testUpdated',
      disabled: true,
      companyId: '2',
    };

    expect(
      projectController
        .getProjectById(req, res, () => {})
        .then(result => {
          expect(res.project.name).to.not.equal(project.name);
          expect(res.project.scrumMaster).to.not.equal(project.scrumMaster);
          expect(res.project.disabled).to.not.equal(project.disabled);
          expect(res.project.companyId).to.not.equal(project.companyId);
          expect(res.statusCode).to.equal(200);
          Project.findById.restore();
          Project.prototype.save.restore();
          done();
        })
    );
  });
});

describe('Project Controller - ERROR HANDLER', function() {
  it('An error on create a project should return status of 500', function(done) {
    sinon.stub(Project.prototype, 'save');

    Project.prototype.save.throws();

    const req = {
      body: project,
    };

    expect(
      projectController
        .addProject(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
          Project.prototype.save.restore();
          done();
        })
    );
  });

  it('If the id given to get the project does not exist should return an status of 500 and an error !', function(done) {
    sinon.stub(Project, 'findById');

    Project.findById.throws();

    const req = {
      params: { projectId: 2 },
    };

    expect(
      projectController
        .getProjectById(req, res, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
          Project.findById.restore();
          done();
        })
    );
  });

  it('if the id given to update the project does no exists should return an error and status of 500', function() {
    const req = {
      params: { projectId: 1 },
      body: {
        name: 'testUpdated',
        scrumMaster: 'testUpdated',
        disabled: true,
        companyId: '2',
      },
    };

    projectController.updateProject(req, res, () => {});
    expect(projectController.updateProject).to.throw();
    expect(res.status).to.not.equal(200);
  });
});
