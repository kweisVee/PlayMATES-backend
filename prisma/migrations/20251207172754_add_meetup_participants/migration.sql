-- CreateTable
CREATE TABLE "MeetupParticipant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "meetupId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetupParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MeetupParticipant_meetupId_idx" ON "MeetupParticipant"("meetupId");

-- CreateIndex
CREATE INDEX "MeetupParticipant_userId_idx" ON "MeetupParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetupParticipant_userId_meetupId_key" ON "MeetupParticipant"("userId", "meetupId");

-- AddForeignKey
ALTER TABLE "MeetupParticipant" ADD CONSTRAINT "MeetupParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupParticipant" ADD CONSTRAINT "MeetupParticipant_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
