import { PrismaClientSingleton } from "./dbConnection";

const prisma = PrismaClientSingleton.getInstance();

export const saveRecurringReservations = async (reservations: any) => {
  console.log("causafhdauhsa");
  let previousReservation = null;
  console.log(reservations);
  for (let i = 0; i < reservations.length; i++) {
    const reservationData = reservations[i];
    console.log("asdfasfsa");
    const reservation: any = await prisma.reservation.create({
      data: {
        title: reservationData.title ?? "Recurring reservation",
        owner: reservationData.owner,
        dateStart: reservationData.dateStart,
        dateEnd: reservationData.dateEnd,
        classId: 1,
        previousId: previousReservation ? previousReservation.id : null,
        isCompleted: true,
      },
    });

    console.log("Created reservation", reservation);
    if (previousReservation) {
      await prisma.reservation.update({
        where: { id: previousReservation.id },
        data: { nextId: reservation.id },
      });
    }

    previousReservation = reservation;
  }
};
