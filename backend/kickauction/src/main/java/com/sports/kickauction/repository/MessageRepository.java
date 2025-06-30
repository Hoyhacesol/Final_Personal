package com.sports.kickauction.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // 1:1 대화 전체 가져오기 (나 ↔ 상대방, soft delete 제외)
    @Query("""
        select m from Message m
        where
            (
                (m.sender = :me and m.receiver = :target and m.deletedBySender = false)
                or
                (m.sender = :target and m.receiver = :me and m.deletedByReceiver = false)
            )
        order by m.sentAt asc
    """)
    List<Message> findDialog(Member me, Member target);

    // 내가 받은 메시지함(받은 쪽지함) - soft delete 제외
    List<Message> findByReceiverAndDeletedByReceiverFalseOrderBySentAtDesc(Member receiver);

    // 내가 보낸 메시지함(보낸 쪽지함) - soft delete 제외
    List<Message> findBySenderAndDeletedBySenderFalseOrderBySentAtDesc(Member sender);

    // (선택) 쌍방 모두 soft delete된 메시지 찾기 (실제 삭제 등)
    List<Message> findByDeletedBySenderTrueAndDeletedByReceiverTrue();

    @Query(value = """
    SELECT
      CASE WHEN m.sender_id = :myMno THEN m.receiver_id ELSE m.sender_id END as partner_mno,
      CASE WHEN m.sender_id = :myMno THEN recv.user_name ELSE send.user_name END as partner_name,
      CASE WHEN m.sender_id = :myMno THEN recv.profileimg ELSE send.profileimg END as partner_profile_img,
      m.content as last_message,
      m.sent_at as last_sent_at,
      SUM(CASE WHEN m.receiver_id = :myMno AND m.deleted_by_receiver = false THEN 1 ELSE 0 END) as unread_count
    FROM message m
    JOIN member send ON m.sender_id = send.mno
    JOIN member recv ON m.receiver_id = recv.mno
    WHERE (m.sender_id = :myMno OR m.receiver_id = :myMno)
    AND (m.deleted_by_sender = false OR m.deleted_by_receiver = false)
    AND m.sent_at = (
        SELECT MAX(m2.sent_at)
        FROM message m2
        WHERE
            ((m2.sender_id = :myMno AND m2.receiver_id = CASE WHEN m.sender_id = :myMno THEN m.receiver_id ELSE m.sender_id END)
            OR (m2.receiver_id = :myMno AND m2.sender_id = CASE WHEN m.sender_id = :myMno THEN m.receiver_id ELSE m.sender_id END))
    )
    GROUP BY partner_mno, partner_name, partner_profile_img, m.content, m.sent_at
    ORDER BY m.sent_at DESC
    """, nativeQuery = true)
    List<Object[]> findAllRoomsByMemberNative(@Param("myMno") Long myMno);
}
