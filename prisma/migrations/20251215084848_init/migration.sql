-- CreateTable
CREATE TABLE "GoogleWorkspaceConnection" (
    "id" TEXT NOT NULL,
    "domainName" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "serviceAccount" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleWorkspaceConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncedGoogleClass" (
    "id" TEXT NOT NULL,
    "googleClassId" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "section" TEXT,
    "room" TEXT,
    "teacherEmail" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "studentCount" INTEGER NOT NULL DEFAULT 0,
    "lastRosterSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncedGoogleClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncedGoogleStudent" (
    "id" TEXT NOT NULL,
    "googleUserId" TEXT NOT NULL,
    "googleEmail" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncedGoogleStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleClassroomAssignment" (
    "id" TEXT NOT NULL,
    "googleAssignmentId" TEXT,
    "betterSchoolContentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "contentUrl" TEXT NOT NULL,
    "maxPoints" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleClassroomAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleGradeSync" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "maxPoints" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "syncedToGoogle" BOOLEAN NOT NULL DEFAULT false,
    "syncError" TEXT,
    "lastSyncAttempt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleGradeSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssignmentStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AssignmentStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncedGoogleClass_googleClassId_key" ON "SyncedGoogleClass"("googleClassId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedGoogleStudent_googleUserId_key" ON "SyncedGoogleStudent"("googleUserId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleClassroomAssignment_googleAssignmentId_key" ON "GoogleClassroomAssignment"("googleAssignmentId");

-- CreateIndex
CREATE INDEX "_AssignmentStudents_B_index" ON "_AssignmentStudents"("B");

-- AddForeignKey
ALTER TABLE "SyncedGoogleClass" ADD CONSTRAINT "SyncedGoogleClass_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "GoogleWorkspaceConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncedGoogleStudent" ADD CONSTRAINT "SyncedGoogleStudent_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SyncedGoogleClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleClassroomAssignment" ADD CONSTRAINT "GoogleClassroomAssignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SyncedGoogleClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleGradeSync" ADD CONSTRAINT "GoogleGradeSync_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "GoogleClassroomAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleGradeSync" ADD CONSTRAINT "GoogleGradeSync_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SyncedGoogleStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignmentStudents" ADD CONSTRAINT "_AssignmentStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "GoogleClassroomAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignmentStudents" ADD CONSTRAINT "_AssignmentStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "SyncedGoogleStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
