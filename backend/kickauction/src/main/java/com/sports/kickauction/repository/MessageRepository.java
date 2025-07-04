package com.sports.kickauction.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

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
  sub.partner_mno,
  sub.partner_name,
  sub.partner_profile_img,
  sub.last_message,
  sub.last_sent_at,
  COALESCE(unread.count, 0) AS unread_count
FROM (
    SELECT
      CASE WHEN m.sender_id = :myMno THEN m.receiver_id ELSE m.sender_id END as partner_mno,
      CASE WHEN m.sender_id = :myMno THEN recv.user_name ELSE send.user_name END as partner_name,
      CASE WHEN m.sender_id = :myMno THEN recv.profileimg ELSE send.profileimg END as partner_profile_img,
      m.content as last_message,
      m.sent_at as last_sent_at
    FROM message m
    JOIN member send ON m.sender_id = send.mno
    JOIN member recv ON m.receiver_id = recv.mno
    WHERE (m.sender_id = :myMno OR m.receiver_id = :myMno)
      AND (m.deleted_by_sender = false OR m.deleted_by_receiver = false)
      AND m.sent_at = (
          SELECT MAX(m2.sent_at)
          FROM message m2
          WHERE ((m2.sender_id = :myMno AND m2.receiver_id = CASE WHEN m.sender_id = :myMno THEN m.receiver_id ELSE m.sender_id END)
              OR (m2.receiver_id = :myMno AND m2.sender_id = CASE WHEN m.sender_id = :myMno THEN m.receiver_id ELSE m.sender_id END))
      )
) sub
LEFT JOIN (
    SELECT
      m.sender_id,
      m.receiver_id,
      COUNT(*) as count
    FROM message m
    WHERE m.receiver_id = :myMno
      AND m.is_read = false
      AND m.deleted_by_receiver = false
    GROUP BY m.sender_id, m.receiver_id
) unread
ON unread.sender_id = sub.partner_mno AND unread.receiver_id = :myMno
ORDER BY sub.last_sent_at DESC
    """, nativeQuery = true)
    List<Object[]> findAllRoomsByMemberNative(@Param("myMno") Long myMno);

    // 상대방이 보낸 메세지 중 읽지 않은 메세지를 읽음 처리함
    @Transactional
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.receiver = :me AND m.sender = :target AND m.isRead = false")
    int markMessagesAsRead(@Param("me") Member me, @Param("target") Member target);

    List<Message> findBySenderAndReceiverAndIsReadFalse(Member sender, Member receiver);

    // 읽지 않은 메세지 총 개수 카운팅
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = :me AND m.isRead = false AND m.deletedByReceiver = false")
    long countUnreadByReceiver(@Param("me") Member me);

    //주석: 탈퇴시 삭제처리
    void deleteBysender_Mno(Long sender);
    void deleteByReceiver_Mno(Long receiverMno);
}
